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

const organizerReadTimeout = 30 * time.Minute

type OrganizerConnection struct {
	Organizer    *authentication.Organizer
	wsConnection *websocket.Conn
	logger       *log.Logger
	messages     chan *OrganizerMessage
	shutdowns    chan *OrganizerConnection
	writeMu      sync.Mutex
}

func NewOrganizerConnection(
	organizer *authentication.Organizer, wsConnection *websocket.Conn, messages chan *OrganizerMessage,
	shutdowns chan *OrganizerConnection, logger *log.Logger,
) (*OrganizerConnection, error) {
	organizerConnection := &OrganizerConnection{
		Organizer:    organizer,
		logger:       logger,
		messages:     messages,
		shutdowns:    shutdowns,
		wsConnection: wsConnection,
	}
	err := organizerConnection.wsConnection.SetReadDeadline(time.Now().Add(organizerReadTimeout))
	if err != nil {
		return nil, err
	}

	go organizerConnection.listenOnConnection()
	return organizerConnection, nil
}

func (oc *OrganizerConnection) listenOnConnection() {
	defer func() {
		if r := recover(); r != nil {
			oc.logger.Printf("panic %v\n", r)
			oc.Close()
			return
		}
	}()

	for {
		msg, err := oc.read()
		if err != nil {
			if !oc.handleReadError(err) {
				return
			}
			continue
		}

		oc.resetReadTimer()
		oc.messages <- NewOrganizerMessage(msg, oc)
	}
}

func (oc *OrganizerConnection) handleReadError(err error) bool {
	if os.IsTimeout(err) {
		oc.logger.Printf("timeout from %s\n", oc.GetInfo())
		oc.SendError(common.ErrTimeout)
		oc.Close()
		return false
	}

	closeError := &websocket.CloseError{}
	if errors.As(err, &closeError) {
		oc.logger.Printf("close error from %s: %s\n", oc.GetInfo(), err)
		oc.Close()
		return false
	}

	oc.logger.Printf("malformed message from %s: %s\n", oc.GetInfo(), err)
	oc.SendError(common.ErrMalformedMessage)
	return true
}

func (oc *OrganizerConnection) resetReadTimer() {
	err := oc.wsConnection.SetReadDeadline(time.Now().Add(organizerReadTimeout))
	if err != nil {
		oc.Close()
	}
}

func (oc *OrganizerConnection) read() (*protocol.Message, error) {
	msg := &protocol.Message{}
	return msg, oc.wsConnection.ReadJSON(msg)
}

func (oc *OrganizerConnection) GetInfo() string {
	return fmt.Sprintf("organizer %d (%s)", oc.Organizer.Id, oc.wsConnection.RemoteAddr())
}

func (oc *OrganizerConnection) Send(outMsg *protocol.Message) {
	oc.writeMu.Lock()
	defer oc.writeMu.Unlock()

	err := oc.wsConnection.WriteJSON(outMsg)
	if err != nil {
		oc.logger.Printf("could not send %s to %s: %s\n", outMsg.Type, oc.GetInfo(), err)
		return
	}
}

func (oc *OrganizerConnection) SendInfo(info string) {
	outMsg, e := out.BuildInfo(info)
	if e != nil {
		oc.logger.Printf("could not parse info for %s: %s\n", oc.GetInfo(), e)
		return
	}
	oc.Send(outMsg)
}

func (oc *OrganizerConnection) SendError(err error) {
	outMsg, e := out.BuildError(err)
	if e != nil {
		oc.logger.Printf("could not parse error for %s: %s\n", oc.GetInfo(), e)
		return
	}
	oc.Send(outMsg)
}

func (oc *OrganizerConnection) Close() {
	oc.writeMu.Lock()
	defer oc.writeMu.Unlock()

	oc.shutdowns <- oc
	oc.wsConnection.Close()
	oc.logger.Printf("closed connection for %s\n", oc.GetInfo())
}
