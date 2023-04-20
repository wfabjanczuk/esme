package participants

import (
	"messenger-api/internal/modules/common"
	"messenger-api/internal/modules/ws/layers/protocol"
	"messenger-api/internal/modules/ws/layers/protocol/in"
	"messenger-api/internal/modules/ws/layers/protocol/out"
)

func (c *Consumer) consumeGetChatHistory(id int32, msg *protocol.Message) {
	inPayload, err := in.ParseGetChatHistoryPayload(msg)
	if err != nil {
		c.logger.Printf("participant %d sent invalid %s payload\n", id, msg.Type)
		c.participantsManager.SendError(id, common.ErrInvalidMessagePayload)
		return
	}

	chatMessages, err := c.messagesRepository.FindAll(inPayload.ChatId)
	if err != nil {
		c.logger.Printf(
			"participant %d could not fetch chat %s messages: %s\n", id, inPayload.ChatId, err,
		)
		c.participantsManager.SendError(id, common.ErrMessagesNotFetchedFromDb)
		return
	}

	outMsg, err := out.BuildChatHistory(inPayload.ChatId, chatMessages)
	if err != nil {
		c.logger.Printf(
			"could not send %s to participant %d: %s\n", out.MsgTypeChatHistory, id, err,
		)
		c.participantsManager.SendError(id, common.ErrInternal)
		return
	}

	c.participantsManager.Send(id, outMsg)
}
