package connections

import (
	"github.com/gorilla/websocket"
	"log"
	"messenger-api/internal/modules/authentication"
	"messenger-api/internal/modules/ws/protocol"
	"time"
)

type ParticipantConnection struct {
	Ws          *websocket.Conn
	Participant *authentication.Participant
	ChatIds     []string
	logger      *log.Logger
}

func NewParticipantConnection(
	wsConnection *websocket.Conn, participant *authentication.Participant, logger *log.Logger,
) (*ParticipantConnection, error) {
	conn := &ParticipantConnection{
		Ws:          wsConnection,
		Participant: participant,
		logger:      logger,
	}
	err := conn.Ws.SetReadDeadline(time.Now().Add(ReadTimeout))
	if err != nil {
		return nil, err
	}
	return conn, nil
}

func (c *ParticipantConnection) ResetReadTimer() {
	err := c.Ws.SetReadDeadline(time.Now().Add(ReadTimeout))
	if err != nil {
		c.Close()
	}
}

func (c *ParticipantConnection) Close() {
	c.Ws.Close()
	c.logger.Printf("closed connection for participant %s\n", c.Ws.RemoteAddr())
}

func (c *ParticipantConnection) Send(msg *protocol.Message) error {
	return c.Ws.WriteJSON(msg)
}
