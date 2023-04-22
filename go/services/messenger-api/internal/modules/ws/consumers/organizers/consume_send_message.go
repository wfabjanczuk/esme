package organizers

import (
	"messenger-api/internal/modules/common"
	"messenger-api/internal/modules/infrastructure/messages"
	"messenger-api/internal/modules/ws/connections"
	"messenger-api/internal/modules/ws/protocol/in"
)

func (c *Consumer) consumeSendMessage(msg *connections.OrganizerMessage) {
	id := msg.Source.Organizer.Id
	inPayload, err := in.ParseSendMessagePayload(msg.Message)
	if err != nil {
		c.logger.Printf("organizer %d sent invalid %s payload\n", id, msg.Message.Type)
		msg.Source.SendError(common.ErrInvalidMessagePayload)
		return
	}

	if !c.chatsManager.IsOrganizerInChat(id, inPayload.ChatId) {
		c.logger.Printf("organizer %d has no access to chat %s\n", id, inPayload.ChatId)
		msg.Source.SendError(common.NewErrNoAccessToChat(inPayload.ChatId))
		return
	}

	organizerMessage := &messages.Message{
		ChatId:        inPayload.ChatId,
		Content:       inPayload.Message,
		FromOrganizer: 1,
		AuthorId:      id,
		TimeSent:      msg.TimeReceived,
	}
	err = c.chatsManager.SendUserMessageToChat(inPayload.ChatId, organizerMessage)
	if err != nil {
		msg.Source.SendError(err)
		return
	}
}
