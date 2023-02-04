package organizers

import (
	"encoding/json"
	"messenger-api/internal/modules/ws/connections"
	"messenger-api/internal/modules/ws/protocol"
	"messenger-api/internal/modules/ws/protocol/in"
	"messenger-api/internal/modules/ws/protocol/out"
)

func (c *Consumer) consumeGetChatHistory(conn *connections.OrganizerConnection, msg *protocol.Message) {
	var inPayload in.GetChatHistoryPayload
	err := json.Unmarshal(msg.Payload, &inPayload)
	if err != nil {
		c.logger.Printf("%s sent invalid %s payload\n", conn.GetInfo(), msg.Type)
		return
	}

	chatMessages, err := c.messagesRepository.FindAll(inPayload.ChatId)
	if err != nil {
		c.logger.Printf("%s could not fetch chat %s messages: %s\n", conn.GetInfo(), inPayload.ChatId, err)
		return
	}

	outPayloadBytes, err := json.Marshal(
		out.ChatHistoryPayload{
			ChatId:   inPayload.ChatId,
			Messages: chatMessages,
		},
	)
	if err != nil {
		c.logger.Printf("could not send %s to %s: %s\n", msg.Type, conn.GetInfo(), err)
		return
	}

	conn.Send(
		&protocol.Message{
			Type:    out.MsgTypeChatHistory,
			Payload: outPayloadBytes,
		},
	)
}
