package participants

import (
	"log"
	"messenger-api/internal/modules/authentication"
	"messenger-api/internal/modules/common"
	"messenger-api/internal/modules/infrastructure"
	"messenger-api/internal/modules/infrastructure/chats"
	"messenger-api/internal/modules/infrastructure/messages"
	"messenger-api/internal/modules/ws/layers"
	"messenger-api/internal/modules/ws/layers/protocol"
	"messenger-api/internal/modules/ws/layers/protocol/in"
)

type Consumer struct {
	chatsRepository     *chats.Repository
	messagesRepository  *messages.Repository
	participantsManager layers.ParticipantsManager
	chatsManager        layers.ChatsManager
	logger              *log.Logger
}

func NewConsumer(
	infra *infrastructure.Module, participantsManager layers.ParticipantsManager, chatsManager layers.ChatsManager,
	logger *log.Logger,
) *Consumer {
	return &Consumer{
		participantsManager: participantsManager,
		chatsManager:        chatsManager,
		chatsRepository:     infra.ChatsRepository,
		messagesRepository:  infra.MessagesRepository,
		logger:              logger,
	}
}

func (c *Consumer) ConsumeMessage(participant *authentication.Participant, msg *protocol.Message) {
	switch msg.Type {
	case in.MsgTypeGetChats:
		c.consumeGetChats(participant.Id)
	case in.MsgTypeSendMessage:
		c.consumeSendMessage(participant.Id, msg)
	case in.MsgTypeGetChatHistory:
		c.consumeGetChatHistory(participant.Id, msg)
	default:
		c.logger.Printf("invalid message type %s from participant %d\n", msg.Type, participant.Id)
		c.participantsManager.SendError(participant.Id, common.ErrInvalidMessageType)
	}
}
