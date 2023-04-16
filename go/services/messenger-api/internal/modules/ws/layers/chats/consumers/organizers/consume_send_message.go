package organizers

import (
	"messenger-api/internal/modules/common"
	"messenger-api/internal/modules/infrastructure/messages"
	"messenger-api/internal/modules/ws/protocol"
	"messenger-api/internal/modules/ws/protocol/in"
)

func (c *Consumer) consumeSendMessage(id int32, msg *protocol.Message) {
	inPayload, err := in.ParseSendMessagePayload(msg)
	if err != nil {
		c.logger.Printf("organizer %d sent invalid %s payload\n", id, msg.Type)
		c.usersManager.SendErrorToOrganizer(id, common.ErrInvalidMessagePayload)
		return
	}

	if !c.chatsManager.IsOrganizerInChat(id, inPayload.ChatId) {
		c.logger.Printf("organizer %d has no access to chat %s\n", id, inPayload.ChatId)
		c.usersManager.SendErrorToOrganizer(id, common.NewErrNoAccessToChat(inPayload.ChatId))
		return
	}

	organizerMessage := &messages.Message{
		ChatId:        inPayload.ChatId,
		Content:       inPayload.Message,
		FromOrganizer: 1,
		AuthorId:      id,
		TimeSent:      msg.TimeReceived,
	}
	err = c.chatsManager.SendMessageToChat(inPayload.ChatId, organizerMessage)
	if err != nil {
		c.usersManager.SendErrorToOrganizer(id, err)
		return
	}
}
