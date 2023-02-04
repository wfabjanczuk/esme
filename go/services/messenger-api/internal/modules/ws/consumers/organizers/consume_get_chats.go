package organizers

import (
	"encoding/json"
	"messenger-api/internal/modules/ws/connections"
	"messenger-api/internal/modules/ws/protocol"
	"messenger-api/internal/modules/ws/protocol/organizers/out"
)

func (c *Consumer) consumeGetChats(conn *connections.OrganizerConnection, msg *protocol.Message) {
	organizerChats, err := c.chatsRepository.FindAllByOrganizerId(conn.Organizer.Id)
	if err != nil {
		c.logger.Printf("%s could not fetch chats: %s\n", conn.GetInfo(), err)
		return
	}

	outPayloadBytes, err := json.Marshal(&out.ChatsPayload{Chats: organizerChats})
	if err != nil {
		c.logger.Printf("could not send %s to %s: %s", msg.Type, conn.GetInfo(), err)
		return
	}

	conn.Send(
		&protocol.Message{
			Type:    msg.Type,
			Payload: outPayloadBytes,
		},
	)
}
