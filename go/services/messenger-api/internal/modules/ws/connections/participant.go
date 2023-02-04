package connections

import (
	"fmt"
	"github.com/gorilla/websocket"
	"log"
	"messenger-api/internal/modules/authentication"
	"messenger-api/internal/modules/ws/protocol"
	"time"
)

const participantReadTimeout = 30 * time.Minute

type ParticipantConnection struct {
	Participant  *authentication.Participant
	wsConnection *websocket.Conn
	logger       *log.Logger
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

func (c *ParticipantConnection) Send(msg *protocol.Message) error {
	return c.wsConnection.WriteJSON(msg)
}

func (c *ParticipantConnection) Close() {
	c.wsConnection.Close()
	c.logger.Printf("closed connection for %s\n", c.GetInfo())
}
