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

const organizerReadTimeout = 30 * time.Minute

type OrganizerConnection struct {
	Organizer    *authentication.Organizer
	wsConnection *websocket.Conn
	logger       *log.Logger
	outMutex     sync.Mutex
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
	return msg, c.wsConnection.ReadJSON(msg)
}

func (c *OrganizerConnection) Send(outMsg *protocol.Message) {
	c.outMutex.Lock()
	defer c.outMutex.Unlock()

	err := c.wsConnection.WriteJSON(outMsg)
	if err != nil {
		c.logger.Printf("could not send %s to %s: %s\n", outMsg.Type, c.GetInfo(), err)
		return
	}
}

func (c *OrganizerConnection) SendInfo(info string) {
	outMsg, e := out.BuildInfo(info)
	if e != nil {
		c.logger.Printf("could not parse info for %s: %s\n", c.GetInfo(), e)
		return
	}
	c.Send(outMsg)
}

func (c *OrganizerConnection) SendError(err error) {
	outMsg, e := out.BuildError(err)
	if e != nil {
		c.logger.Printf("could not parse error for %s: %s\n", c.GetInfo(), e)
		return
	}
	c.Send(outMsg)
}

func (c *OrganizerConnection) Close() {
	c.wsConnection.Close()
	c.logger.Printf("closed connection for %s\n", c.GetInfo())
}
