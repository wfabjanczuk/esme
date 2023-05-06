package connections

import (
	"errors"
	"fmt"
	"github.com/gorilla/websocket"
	"log"
	"messenger-api/internal/modules/authentication"
	"messenger-api/internal/modules/common"
	"messenger-api/internal/modules/ws/protocol"
	"messenger-api/internal/modules/ws/protocol/out"
	"os"
	"sync"
	"time"
)

const participantReadTimeout = 30 * time.Minute

type ParticipantConnection struct {
	Participant  *authentication.Participant
	wsConnection *websocket.Conn
	logger       *log.Logger
	messages     chan *ParticipantMessage
	shutdowns    chan *ParticipantConnection
	writeMu      sync.Mutex
}

func NewParticipantConnection(
	participant *authentication.Participant, wsConnection *websocket.Conn, messages chan *ParticipantMessage,
	shutdowns chan *ParticipantConnection, logger *log.Logger,
) (*ParticipantConnection, error) {
	participantConnection := &ParticipantConnection{
		Participant:  participant,
		wsConnection: wsConnection,
		messages:     messages,
		shutdowns:    shutdowns,
		logger:       logger,
	}
	err := participantConnection.wsConnection.SetReadDeadline(time.Now().Add(participantReadTimeout))
	if err != nil {
		return nil, err
	}

	go participantConnection.listenOnConnection()
	return participantConnection, nil
}

func (pc *ParticipantConnection) listenOnConnection() {
	defer func() {
		if r := recover(); r != nil {
			pc.logger.Printf("panic %v\n", r)
			pc.Close()
			return
		}
	}()

	for {
		msg, err := pc.read()
		if err != nil {
			if !pc.handleReadError(err) {
				return
			}
			continue
		}

		pc.resetReadTimer()
		pc.messages <- NewParticipantMessage(msg, pc)
	}
}

func (pc *ParticipantConnection) handleReadError(err error) bool {
	if os.IsTimeout(err) {
		pc.logger.Printf("timeout from %s\n", pc.GetInfo())
		pc.SendError(common.ErrTimeout)
		pc.Close()
		return false
	}

	closeError := &websocket.CloseError{}
	if errors.As(err, &closeError) {
		pc.logger.Printf("close error from %s: %s\n", pc.GetInfo(), err)
		pc.Close()
		return false
	}

	pc.logger.Printf("malformed message from %s: %s\n", pc.GetInfo(), err)
	pc.SendError(common.ErrMalformedMessage)
	return true
}

func (pc *ParticipantConnection) resetReadTimer() {
	err := pc.wsConnection.SetReadDeadline(time.Now().Add(participantReadTimeout))
	if err != nil {
		pc.Close()
	}
}

func (pc *ParticipantConnection) read() (*protocol.Message, error) {
	msg := &protocol.Message{}
	err := pc.wsConnection.ReadJSON(msg)
	return msg, err
}

func (pc *ParticipantConnection) GetInfo() string {
	return fmt.Sprintf("participant %d (%s)", pc.Participant.Id, pc.wsConnection.RemoteAddr())
}

func (pc *ParticipantConnection) Send(outMsg *protocol.Message) {
	pc.writeMu.Lock()
	defer pc.writeMu.Unlock()

	err := pc.wsConnection.WriteJSON(outMsg)
	if err != nil {
		pc.logger.Printf("could not send %s to %s: %s\n", outMsg.Type, pc.GetInfo(), err)
		return
	}
}

func (pc *ParticipantConnection) SendInfo(info string) {
	outMsg, e := out.BuildInfo(info)
	if e != nil {
		pc.logger.Printf("could not parse info for %s: %s\n", pc.GetInfo(), e)
		return
	}
	pc.Send(outMsg)
}

func (pc *ParticipantConnection) SendError(err error) {
	outMsg, e := out.BuildError(err)
	if e != nil {
		pc.logger.Printf("could not parse error for %s: %s\n", pc.GetInfo(), e)
		return
	}
	pc.Send(outMsg)
}

func (pc *ParticipantConnection) Close() {
	pc.writeMu.Lock()
	defer pc.writeMu.Unlock()

	pc.shutdowns <- pc
	pc.wsConnection.Close()
	pc.logger.Printf("closed connection for %s\n", pc.GetInfo())
}
