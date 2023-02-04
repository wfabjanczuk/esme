package organizers

import (
	"encoding/json"
	"messenger-api/internal/modules/infrastructure/messages"
	"messenger-api/internal/modules/ws/connections"
	"messenger-api/internal/modules/ws/protocol"
	"messenger-api/internal/modules/ws/protocol/organizers/in"
)

func (c *Consumer) consumeSendMessage(conn *connections.OrganizerConnection, msg *protocol.Message) {
	var payload in.SendMessagePayload
	err := json.Unmarshal(msg.Payload, &payload)
	if err != nil {
		c.logger.Printf("%s sent invalid %s payload\n", conn.GetInfo(), msg.Type)
		return
	}

	if !conn.HasChat(payload.ChatId) {
		c.logger.Printf("%s has no access to chat %s\n", conn.GetInfo(), payload.ChatId)
		return
	}

	organizerMessage := &messages.Message{
		ChatId:        payload.ChatId,
		Content:       payload.Message,
		FromOrganizer: 1,
		AuthorId:      conn.Organizer.Id,
		TimeSent:      msg.TimeReceived,
	}
	err = c.chatsWriter.WriteMessageToChat(payload.ChatId, organizerMessage)
	if err != nil {
		c.logger.Println(err)
	}
}
