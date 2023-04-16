package organizers

import (
	"log"
	"messenger-api/internal/modules/infrastructure/chat_requests"
	"messenger-api/internal/modules/infrastructure/chats"
	"messenger-api/internal/modules/infrastructure/messages"
	mgmt_chats "messenger-api/internal/modules/ws/layers/chats"
)

type Consumer struct {
	chatRequestsRepository *chat_requests.Repository
	chatsRepository        *chats.Repository
	messagesRepository     *messages.Repository
	chatsManager           *mgmt_chats.Manager
	logger                 *log.Logger
}

//func NewConsumer(
//	infra *infrastructure.Module, chatsManager *mgmt_chats.Manager, logger *log.Logger,
//) *Consumer {
//	return &Consumer{
//		chatRequestsRepository: infra.ChatRequestsRepository,
//		chatsRepository:        infra.ChatsRepository,
//		messagesRepository:     infra.MessagesRepository,
//		chatsManager:           chatsManager,
//		logger:                 logger,
//	}
//}
//
//func (c *Consumer) consumeMessage(conn *connections.OrganizerConnection, msg *protocol.Message) {
//	switch msg.Type {
//	case in.MsgTypeGetChats:
//		c.consumeGetChats(conn)
//	case in.MsgTypeStartChat:
//		c.consumeStartChat(conn, msg)
//	case in.MsgTypeSendMessage:
//		c.consumeSendMessage(conn, msg)
//	case in.MsgTypeGetChatHistory:
//		c.consumeGetChatHistory(conn, msg)
//	default:
//		c.logger.Printf("invalid message type %s from %s\n", msg.Type, conn.GetInfo())
//		conn.SendError(common.ErrInvalidMessageType)
//	}
//}
//
//func (c *Consumer) closeConnectionResources(conn *connections.OrganizerConnection) {
//	c.chatsManager.DisconnectOrganizer(conn)
//	conn.Close()
//}
