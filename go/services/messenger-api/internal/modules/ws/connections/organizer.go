package connections

import (
	"fmt"
	"github.com/gorilla/websocket"
	"log"
	"messenger-api/internal/modules/authentication"
	"messenger-api/internal/modules/ws/protocol"
	"sync"
	"time"
)

const ReadTimeout = 30 * time.Minute

type OrganizerConnection struct {
	Organizer *authentication.Organizer
	logger    *log.Logger
	chats     map[string]struct{}
	ws        *websocket.Conn
	mu        sync.RWMutex
}

func NewOrganizerConnection(
	wsConnection *websocket.Conn, organizer *authentication.Organizer, logger *log.Logger,
) (*OrganizerConnection, error) {
	conn := &OrganizerConnection{
		ws:        wsConnection,
		Organizer: organizer,
		chats:     make(map[string]struct{}),
		logger:    logger,
	}
	err := conn.ws.SetReadDeadline(time.Now().Add(ReadTimeout))
	if err != nil {
		return nil, err
	}
	return conn, nil
}

func (c *OrganizerConnection) ResetReadTimer() {
	err := c.ws.SetReadDeadline(time.Now().Add(ReadTimeout))
	if err != nil {
		c.Close()
	}
}

func (c *OrganizerConnection) Close() {
	c.ws.Close()
	c.logger.Printf("closed connection for %s\n", c.GetInfo())
}

func (c *OrganizerConnection) GetInfo() string {
	return fmt.Sprintf("organizer %d (%s)", c.Organizer.Id, c.ws.RemoteAddr())
}

func (c *OrganizerConnection) HasChat(chatId string) bool {
	c.mu.RLock()
	defer c.mu.RUnlock()

	_, exists := c.chats[chatId]
	return exists
}

func (c *OrganizerConnection) AddChat(chatId string) {
	c.mu.Lock()
	defer c.mu.Unlock()

	c.chats[chatId] = struct{}{}
}

func (c *OrganizerConnection) RemoveChat(chatId string) {
	c.mu.Lock()
	defer c.mu.Unlock()

	delete(c.chats, chatId)
}

func (c *OrganizerConnection) Read() (*protocol.Message, error) {
	msg := &protocol.Message{}
	err := c.ws.ReadJSON(msg)
	return msg, err
}

func (c *OrganizerConnection) Send(msg *protocol.Message) error {
	return c.ws.WriteJSON(msg)
}
