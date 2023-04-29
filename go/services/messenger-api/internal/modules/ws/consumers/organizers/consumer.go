package organizers

import (
	"log"
	"messenger-api/internal/modules/common"
	"messenger-api/internal/modules/infrastructure"
	"messenger-api/internal/modules/infrastructure/chat_requests"
	"messenger-api/internal/modules/infrastructure/chats"
	"messenger-api/internal/modules/infrastructure/enriched_chats"
	"messenger-api/internal/modules/infrastructure/messages"
	"messenger-api/internal/modules/ws/connections"
	"messenger-api/internal/modules/ws/interfaces"
	"messenger-api/internal/modules/ws/protocol/in"
)

type Consumer struct {
	chatRequestsRepository *chat_requests.Repository
	chatsRepository        *chats.Repository
	messagesRepository     *messages.Repository
	enrichedChatsService   *enriched_chats.Service
	chatsManager           interfaces.ChatsManager
	logger                 *log.Logger
}

func NewConsumer(
	infra *infrastructure.Module, chatsManager interfaces.ChatsManager, logger *log.Logger,
) *Consumer {
	return &Consumer{
		chatRequestsRepository: infra.ChatRequestsRepository,
		chatsRepository:        infra.ChatsRepository,
		messagesRepository:     infra.MessagesRepository,
		enrichedChatsService:   infra.EnrichedChatsService,
		chatsManager:           chatsManager,
		logger:                 logger,
	}
}

func (c *Consumer) ConsumeMessage(msg *connections.OrganizerMessage) {
	switch msg.Message.Type {
	case in.MsgTypeGetChats:
		c.consumeGetChats(msg)
	case in.MsgTypeStartChat:
		c.consumeStartChat(msg)
	case in.MsgTypeSendMessage:
		c.consumeSendMessage(msg)
	case in.MsgTypeGetChatHistory:
		c.consumeGetChatHistory(msg)
	default:
		c.logger.Printf("invalid message type %s from organizer %d\n", msg.Message.Type, msg.Source.Organizer.Id)
		msg.Source.SendError(common.ErrInvalidMessageType)
	}
}
