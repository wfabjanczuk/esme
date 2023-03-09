package connections

import (
	"fmt"
	"github.com/gorilla/websocket"
	"log"
	"messenger-api/internal/modules/authentication"
	"messenger-api/internal/modules/ws/protocol"
	"messenger-api/internal/modules/ws/protocol/out"
	"sync"
	"time"
)

const participantReadTimeout = 10 * time.Minute

type ParticipantConnection struct {
	Participant  *authentication.Participant
	wsConnection *websocket.Conn
	logger       *log.Logger
	outMutex     sync.Mutex
}

func NewParticipantConnection(
	participant *authentication.Participant, wsConnection *websocket.Conn, logger *log.Logger,
) (*ParticipantConnection, error) {
	conn := &ParticipantConnection{
		Participant:  participant,
		wsConnection: wsConnection,
		logger:       logger,
	}
	err := conn.wsConnection.SetReadDeadline(time.Now().Add(participantReadTimeout))
	if err != nil {
		return nil, err
	}
	return conn, nil
}

func (c *ParticipantConnection) ResetReadTimer() {
	err := c.wsConnection.SetReadDeadline(time.Now().Add(participantReadTimeout))
	if err != nil {
		c.Close()
	}
}

func (c *ParticipantConnection) GetInfo() string {
	return fmt.Sprintf("participant %d (%s)", c.Participant.Id, c.wsConnection.RemoteAddr())
}

func (c *ParticipantConnection) Read() (*protocol.Message, error) {
	msg := &protocol.Message{}
	err := c.wsConnection.ReadJSON(msg)
	return msg, err
}

func (c *ParticipantConnection) Send(outMsg *protocol.Message) {
	c.outMutex.Lock()
	defer c.outMutex.Unlock()

	err := c.wsConnection.WriteJSON(outMsg)
	if err != nil {
		c.logger.Printf("could not send %s to %s: %s\n", outMsg.Type, c.GetInfo(), err)
		return
	}
}

func (c *ParticipantConnection) SendInfo(info string) {
	outMsg, e := out.BuildInfo(info)
	if e != nil {
		c.logger.Printf("could not parse info for %s: %s\n", c.GetInfo(), e)
		return
	}
	c.Send(outMsg)
}

func (c *ParticipantConnection) SendError(err error) {
	outMsg, e := out.BuildError(err)
	if e != nil {
		c.logger.Printf("could not parse error for %s: %s\n", c.GetInfo(), e)
		return
	}
	c.Send(outMsg)
}

func (c *ParticipantConnection) Close() {
	c.wsConnection.Close()
	c.logger.Printf("closed connection for %s\n", c.GetInfo())
}
