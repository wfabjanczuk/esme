package participants

import (
	"messenger-api/internal/modules/common"
	"messenger-api/internal/modules/ws/connections"
	"messenger-api/internal/modules/ws/protocol/in"
	"messenger-api/internal/modules/ws/protocol/out"
)

func (c *Consumer) consumeGetChatHistory(msg *connections.ParticipantMessage) {
	id := msg.Source.Participant.Id
	inPayload, err := in.ParseGetChatHistoryPayload(msg.Message)
	if err != nil {
		c.logger.Printf("participant %d sent invalid %s payload\n", id, msg.Message.Type)
		msg.Source.SendError(common.ErrInvalidMessagePayload)
		return
	}

	if !c.chatsManager.IsParticipantInChat(id, inPayload.ChatId) {
		c.logger.Printf("participant %d has no access to chat %s\n", id, inPayload.ChatId)
		msg.Source.SendError(common.NewErrNoAccessToChat(inPayload.ChatId))
		return
	}

	chatMessages, err := c.messagesRepository.FindAll(inPayload.ChatId)
	if err != nil {
		c.logger.Printf(
			"participant %d could not fetch chat %s messages: %s\n", id, inPayload.ChatId, err,
		)
		msg.Source.SendError(common.ErrMessagesNotFetchedFromDb)
		return
	}

	outMsg, err := out.BuildChatHistory(inPayload.ChatId, chatMessages)
	if err != nil {
		c.logger.Printf(
			"could not send %s to participant %d: %s\n", out.MsgTypeChatHistory, id, err,
		)
		msg.Source.SendError(common.ErrInternal)
		return
	}

	msg.Source.Send(outMsg)
}
