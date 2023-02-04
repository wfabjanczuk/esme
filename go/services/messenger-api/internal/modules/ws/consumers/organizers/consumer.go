package organizers

import (
	"errors"
	"github.com/gorilla/websocket"
	"log"
	"messenger-api/internal/modules/infrastructure"
	"messenger-api/internal/modules/infrastructure/chat_requests"
	"messenger-api/internal/modules/infrastructure/chats"
	"messenger-api/internal/modules/infrastructure/messages"
	"messenger-api/internal/modules/ws/connections"
	"messenger-api/internal/modules/ws/protocol"
	"messenger-api/internal/modules/ws/protocol/organizers/in"
	wchats "messenger-api/internal/modules/ws/writers/chats"
	"os"
	"time"
)

type Consumer struct {
	chatRequestsRepository *chat_requests.Repository
	chatsRepository        *chats.Repository
	messagesRepository     *messages.Repository
	chatsWriter            *wchats.Writer
	logger                 *log.Logger
}

func NewConsumer(
	infra *infrastructure.Module, chatsWriter *wchats.Writer, logger *log.Logger,
) *Consumer {
	return &Consumer{
		chatRequestsRepository: infra.ChatRequestsRepository,
		chatsRepository:        infra.ChatsRepository,
		messagesRepository:     infra.MessagesRepository,
		chatsWriter:            chatsWriter,
		logger:                 logger,
	}
}

func (c *Consumer) ListenOnConnection(conn *connections.OrganizerConnection) {
	defer func() {
		if r := recover(); r != nil {
			c.logger.Printf("error %v\n", r)
		}
	}()

	for {
		msg, err := conn.Read()
		if err != nil {
			c.handleReadError(conn, err)
			continue
		}

		conn.ResetReadTimer()
		msg.TimeReceived = time.Now()
		go c.consumeMessage(conn, msg)
	}
}

func (c *Consumer) consumeMessage(conn *connections.OrganizerConnection, msg *protocol.Message) {
	switch msg.Type {
	case in.StartChat:
		c.consumeStartChat(conn, msg)
	case in.GetChats:
		c.consumeGetChats(conn, msg)
	case in.SendMessage:
		c.consumeSendMessage(conn, msg)
	case in.GetChatHistory:
		c.consumeGetChatHistory(conn, msg)
	}
}

func (c *Consumer) handleReadError(conn *connections.OrganizerConnection, err error) {
	if os.IsTimeout(err) {
		c.logger.Printf("%s timeout\n", conn.GetInfo())
		conn.Close()
		return
	}

	closeError := &websocket.CloseError{}
	if errors.As(err, &closeError) {
		c.logger.Printf("%s close error: %s\n", conn.GetInfo(), err)
		return
	}

	c.logger.Printf("%s unexpected error: %s\n", conn.GetInfo(), err)
}
