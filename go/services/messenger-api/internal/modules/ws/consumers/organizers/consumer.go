package organizers

import (
	"errors"
	"github.com/gorilla/websocket"
	"log"
	"messenger-api/internal/modules/common"
	"messenger-api/internal/modules/infrastructure"
	"messenger-api/internal/modules/infrastructure/chat_requests"
	"messenger-api/internal/modules/infrastructure/chats"
	"messenger-api/internal/modules/infrastructure/messages"
	"messenger-api/internal/modules/ws/connections"
	mgmt_chats "messenger-api/internal/modules/ws/managers/chats"
	"messenger-api/internal/modules/ws/protocol"
	"messenger-api/internal/modules/ws/protocol/in"
	"os"
	"time"
)

type Consumer struct {
	chatRequestsRepository *chat_requests.Repository
	chatsRepository        *chats.Repository
	messagesRepository     *messages.Repository
	chatsManager           *mgmt_chats.Manager
	logger                 *log.Logger
}

func NewConsumer(
	infra *infrastructure.Module, chatsManager *mgmt_chats.Manager, logger *log.Logger,
) *Consumer {
	return &Consumer{
		chatRequestsRepository: infra.ChatRequestsRepository,
		chatsRepository:        infra.ChatsRepository,
		messagesRepository:     infra.MessagesRepository,
		chatsManager:           chatsManager,
		logger:                 logger,
	}
}

func (c *Consumer) ListenOnConnection(conn *connections.OrganizerConnection) {
	defer func() {
		if r := recover(); r != nil {
			c.logger.Printf("panic %v\n", r)
			c.closeConnectionResources(conn)
			return
		}
	}()

	c.consumeGetChats(conn)
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

func (c *Consumer) consumeMessage(conn *connections.OrganizerConnection, msg *protocol.Message) {
	switch msg.Type {
	case in.MsgTypeGetChats:
		c.consumeGetChats(conn)
	case in.MsgTypeStartChat:
		c.consumeStartChat(conn, msg)
	case in.MsgTypeSendMessage:
		c.consumeSendMessage(conn, msg)
	case in.MsgTypeGetChatHistory:
		c.consumeGetChatHistory(conn, msg)
	default:
		c.logger.Printf("invalid message type %s from %s\n", msg.Type, conn.GetInfo())
		conn.SendError(common.ErrInvalidMessageType)
	}
}

func (c *Consumer) handleReadError(conn *connections.OrganizerConnection, err error) bool {
	if os.IsTimeout(err) {
		c.logger.Printf("timeout from %s\n", conn.GetInfo())
		conn.SendError(common.ErrTimeout)
		c.closeConnectionResources(conn)
		return false
	}

	closeError := &websocket.CloseError{}
	if errors.As(err, &closeError) {
		c.logger.Printf("close error from %s: %s\n", conn.GetInfo(), err)
		c.closeConnectionResources(conn)
		return false
	}

	c.logger.Printf("malformed message from %s: %s\n", conn.GetInfo(), err)
	conn.SendError(common.ErrMalformedMessage)
	return true
}

func (c *Consumer) closeConnectionResources(conn *connections.OrganizerConnection) {
	c.chatsManager.DisconnectOrganizer(conn)
	conn.Close()
}
