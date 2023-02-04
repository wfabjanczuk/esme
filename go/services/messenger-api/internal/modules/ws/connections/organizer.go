package connections

import (
	"fmt"
	"github.com/gorilla/websocket"
	"log"
	"messenger-api/internal/modules/authentication"
	"messenger-api/internal/modules/ws/protocol"
	"time"
)

const organizerReadTimeout = 30 * time.Second

type OrganizerConnection struct {
	Organizer    *authentication.Organizer
	wsConnection *websocket.Conn
	logger       *log.Logger
}

func NewOrganizerConnection(
	organizer *authentication.Organizer, wsConnection *websocket.Conn, logger *log.Logger,
) (*OrganizerConnection, error) {
	conn := &OrganizerConnection{
		Organizer:    organizer,
		logger:       logger,
		wsConnection: wsConnection,
	}
	err := conn.wsConnection.SetReadDeadline(time.Now().Add(organizerReadTimeout))
	if err != nil {
		return nil, err
	}
	return conn, nil
}

func (c *OrganizerConnection) ResetReadTimer() {
	err := c.wsConnection.SetReadDeadline(time.Now().Add(organizerReadTimeout))
	if err != nil {
		c.Close()
	}
}

func (c *OrganizerConnection) GetInfo() string {
	return fmt.Sprintf("organizer %d (%s)", c.Organizer.Id, c.wsConnection.RemoteAddr())
}

func (c *OrganizerConnection) Read() (*protocol.Message, error) {
	msg := &protocol.Message{}
	err := c.wsConnection.ReadJSON(msg)
	return msg, err
}

func (c *OrganizerConnection) Send(msg *protocol.Message) error {
	return c.wsConnection.WriteJSON(msg)
}

func (c *OrganizerConnection) Close() {
	c.wsConnection.Close()
	c.logger.Printf("closed connection for %s\n", c.GetInfo())
}
