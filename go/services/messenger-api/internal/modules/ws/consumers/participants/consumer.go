package participants

import (
	"log"
	"messenger-api/internal/modules/common"
	"messenger-api/internal/modules/infrastructure"
	"messenger-api/internal/modules/infrastructure/chats"
	"messenger-api/internal/modules/infrastructure/messages"
	"messenger-api/internal/modules/ws/connections"
	"messenger-api/internal/modules/ws/interfaces"
	"messenger-api/internal/modules/ws/protocol/in"
)

type Consumer struct {
	chatsRepository    *chats.Repository
	messagesRepository *messages.Repository
	chatsManager       interfaces.ChatsManager
	logger             *log.Logger
}

func NewConsumer(
	infra *infrastructure.Module, chatsManager interfaces.ChatsManager, logger *log.Logger,
) *Consumer {
	return &Consumer{
		chatsRepository:    infra.ChatsRepository,
		messagesRepository: infra.MessagesRepository,
		chatsManager:       chatsManager,
		logger:             logger,
	}
}

func (c *Consumer) ConsumeMessage(msg *connections.ParticipantMessage) {
	switch msg.Message.Type {
	case in.MsgTypeGetChats:
		c.consumeGetChats(msg)
	case in.MsgTypeSendMessage:
		c.consumeSendMessage(msg)
	case in.MsgTypeGetChatHistory:
		c.consumeGetChatHistory(msg)
	default:
		c.logger.Printf("invalid message type %s from participant %d\n", msg.Message.Type, msg.Source.Participant.Id)
		msg.Source.SendError(common.ErrInvalidMessageType)
	}
}
