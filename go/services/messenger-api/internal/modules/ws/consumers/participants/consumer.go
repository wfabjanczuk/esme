package participants

import (
	"errors"
	"github.com/gorilla/websocket"
	"log"
	"messenger-api/internal/modules/infrastructure"
	"messenger-api/internal/modules/infrastructure/chats"
	"messenger-api/internal/modules/infrastructure/messages"
	"messenger-api/internal/modules/ws/connections"
	mgmt_chats "messenger-api/internal/modules/ws/managers/chats"
	"messenger-api/internal/modules/ws/protocol"
	"os"
	"time"
)

type Consumer struct {
	chatsRepository    *chats.Repository
	messagesRepository *messages.Repository
	chatsManager       *mgmt_chats.Manager
	logger             *log.Logger
}

func NewConsumer(infra *infrastructure.Module, chatsManager *mgmt_chats.Manager, logger *log.Logger) *Consumer {
	return &Consumer{
		chatsRepository:    infra.ChatsRepository,
		messagesRepository: infra.MessagesRepository,
		chatsManager:       chatsManager,
		logger:             logger,
	}
}

func (c *Consumer) ListenOnConnection(conn *connections.ParticipantConnection) {
	defer func() {
		if r := recover(); r != nil {
			c.logger.Printf("panic %v\n", r)
			c.closeConnectionResources(conn)
			return
		}
	}()

	for {
		msg, err := conn.Read()
		if err != nil {
			if !c.handleReadError(conn, err) {
				return
			}
			continue
		}

		conn.ResetReadTimer()
		msg.TimeReceived = time.Now()
		go c.consumeMessage(conn, msg)
	}
}

func (c *Consumer) consumeMessage(conn *connections.ParticipantConnection, msg *protocol.Message) {

}

func (c *Consumer) handleReadError(conn *connections.ParticipantConnection, err error) bool {
	if os.IsTimeout(err) {
		c.logger.Printf("timeout from %s\n", conn.GetInfo())
		c.closeConnectionResources(conn)
		return false
	}

	closeError := &websocket.CloseError{}
	if errors.As(err, &closeError) {
		c.logger.Printf("close error from %s: %s\n", conn.GetInfo(), err)
		c.closeConnectionResources(conn)
		return false
	}

	c.logger.Printf("unexpected error from %s: %s\n", conn.GetInfo(), err)
	return true
}

func (c *Consumer) closeConnectionResources(conn *connections.ParticipantConnection) {
	c.chatsManager.DisconnectParticipant(conn)
	conn.Close()
}
