package participants

import (
	"messenger-api/internal/modules/common"
	"messenger-api/internal/modules/infrastructure/messages"
	"messenger-api/internal/modules/ws/protocol"
	"messenger-api/internal/modules/ws/protocol/in"
)

func (c *Consumer) consumeSendMessage(id int32, msg *protocol.Message) {
	inPayload, err := in.ParseSendMessagePayload(msg)
	if err != nil {
		c.logger.Printf("participant %d sent invalid %s payload\n", id, msg.Type)
		c.usersManager.SendErrorToParticipant(id, common.ErrInvalidMessagePayload)
		return
	}

	if !c.chatsManager.IsParticipantInChat(id, inPayload.ChatId) {
		c.logger.Printf("participant %d has no access to chat %s\n", id, inPayload.ChatId)
		c.usersManager.SendErrorToParticipant(id, common.NewErrNoAccessToChat(inPayload.ChatId))
		return
	}

	participantMessage := &messages.Message{
		ChatId:        inPayload.ChatId,
		Content:       inPayload.Message,
		FromOrganizer: 0,
		AuthorId:      id,
		TimeSent:      msg.TimeReceived,
	}
	err = c.chatsManager.SendMessageToChat(inPayload.ChatId, participantMessage)
	if err != nil {
		c.usersManager.SendErrorToParticipant(id, err)
		return
	}
}
