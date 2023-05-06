package participants

import (
	"messenger-api/internal/modules/common"
	"messenger-api/internal/modules/infrastructure/messages"
	"messenger-api/internal/modules/ws/connections"
	"messenger-api/internal/modules/ws/protocol/in"
)

func (c *Consumer) consumeSendMessage(msg *connections.ParticipantMessage) {
	id := msg.Source.Participant.Id
	inPayload, err := in.ParseSendMessagePayload(msg.Message)
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

	participantMessage := &messages.Message{
		ChatId:        inPayload.ChatId,
		Content:       inPayload.Message,
		FromOrganizer: 0,
		AuthorId:      id,
		TimeSent:      msg.TimeReceived,
		Lat:           inPayload.Lat,
		Lng:           inPayload.Lng,
	}
	err = c.chatsManager.SendUserMessageToChat(inPayload.ChatId, participantMessage)
	if err != nil {
		msg.Source.SendError(err)
		return
	}
}
