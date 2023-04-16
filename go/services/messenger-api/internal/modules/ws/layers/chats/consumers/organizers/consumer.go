package organizers

import (
	"log"
	"messenger-api/internal/modules/authentication"
	"messenger-api/internal/modules/common"
	"messenger-api/internal/modules/infrastructure"
	"messenger-api/internal/modules/infrastructure/chat_requests"
	"messenger-api/internal/modules/infrastructure/chats"
	"messenger-api/internal/modules/infrastructure/messages"
	"messenger-api/internal/modules/ws/layers"
	"messenger-api/internal/modules/ws/protocol"
	"messenger-api/internal/modules/ws/protocol/in"
)

type Consumer struct {
	usersManager           layers.UsersManager
	chatsManager           layers.ChatsManager
	chatRequestsRepository *chat_requests.Repository
	chatsRepository        *chats.Repository
	messagesRepository     *messages.Repository
	logger                 *log.Logger
}

func NewConsumer(
	infra *infrastructure.Module, usersManager layers.UsersManager, chatsManager layers.ChatsManager,
	logger *log.Logger,
) *Consumer {
	return &Consumer{
		usersManager:           usersManager,
		chatsManager:           chatsManager,
		chatRequestsRepository: infra.ChatRequestsRepository,
		chatsRepository:        infra.ChatsRepository,
		messagesRepository:     infra.MessagesRepository,
		logger:                 logger,
	}
}

func (c *Consumer) ConsumeMessage(organizer *authentication.Organizer, msg *protocol.Message) {
	switch msg.Type {
	case in.MsgTypeGetChats:
		c.consumeGetChats(organizer.Id)
	case in.MsgTypeStartChat:
		c.consumeStartChat(organizer, msg)
	case in.MsgTypeSendMessage:
		c.consumeSendMessage(organizer.Id, msg)
	case in.MsgTypeGetChatHistory:
		c.consumeGetChatHistory(organizer.Id, msg)
	default:
		c.logger.Printf("invalid message type %s from organizer %d\n", msg.Type, organizer.Id)
		c.usersManager.SendErrorToOrganizer(organizer.Id, common.ErrInvalidMessageType)
	}
}

//
//func (c *Consumer) closeConnectionResources(conn *connections.OrganizerConnection) {
//	c.chatsManager.DisconnectOrganizer(conn)
//	conn.Close()
//}
