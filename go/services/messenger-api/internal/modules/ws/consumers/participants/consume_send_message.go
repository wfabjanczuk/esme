package participants

import (
	"encoding/json"
	"messenger-api/internal/modules/infrastructure/messages"
	"messenger-api/internal/modules/ws/connections"
	"messenger-api/internal/modules/ws/protocol"
	"messenger-api/internal/modules/ws/protocol/in"
)

func (c *Consumer) consumeSendMessage(conn *connections.ParticipantConnection, msg *protocol.Message) {
	var payload in.SendMessagePayload
	err := json.Unmarshal(msg.Payload, &payload)
	if err != nil {
		c.logger.Printf("%s sent invalid %s payload\n", conn.GetInfo(), msg.Type)
		return
	}

	if !c.chatsManager.HasChatParticipant(payload.ChatId, conn) {
		c.logger.Printf("%s has no access to chat %s\n", conn.GetInfo(), payload.ChatId)
		return
	}

	organizerMessage := &messages.Message{
		ChatId:        payload.ChatId,
		Content:       payload.Message,
		FromOrganizer: 0,
		AuthorId:      conn.Participant.Id,
		TimeSent:      msg.TimeReceived,
	}
	err = c.chatsManager.WriteMessageToChat(payload.ChatId, organizerMessage)
	if err != nil {
		c.logger.Println(err)
		return
	}
}
