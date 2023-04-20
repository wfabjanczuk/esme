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
	"messenger-api/internal/modules/ws/layers/consumers/protocol"
	"messenger-api/internal/modules/ws/layers/consumers/protocol/in"
)

type Consumer struct {
	chatRequestsRepository *chat_requests.Repository
	chatsRepository        *chats.Repository
	messagesRepository     *messages.Repository
	organizersManager      layers.OrganizersManager
	chatsManager           layers.ChatsManager
	logger                 *log.Logger
}

func NewConsumer(
	infra *infrastructure.Module, organizersManager layers.OrganizersManager,
	chatsManager layers.ChatsManager, logger *log.Logger,
) *Consumer {
	return &Consumer{
		chatRequestsRepository: infra.ChatRequestsRepository,
		chatsRepository:        infra.ChatsRepository,
		messagesRepository:     infra.MessagesRepository,
		organizersManager:      organizersManager,
		chatsManager:           chatsManager,
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
		c.organizersManager.SendErrorToOrganizer(organizer.Id, common.ErrInvalidMessageType)
	}
}

//
//func (c *Consumer) closeConnectionResources(conn *connections.OrganizerConnection) {
//	c.chatsManager.DisconnectOrganizer(conn)
//	conn.Close()
//}
