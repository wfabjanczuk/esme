package organizers

import (
	"encoding/json"
	"messenger-api/internal/modules/infrastructure/chats"
	"messenger-api/internal/modules/ws/connections"
	"messenger-api/internal/modules/ws/protocol"
	"messenger-api/internal/modules/ws/protocol/out"
)

func (c *Consumer) consumeStartChat(conn *connections.OrganizerConnection, msg *protocol.Message) {
	chatRequest, ok, err := c.chatRequestsRepository.GetChatRequest(conn.Organizer.AgencyId)
	if err != nil {
		c.logger.Printf("%s get_chat error: %s\n", conn.GetInfo(), err)
		return
	}
	if !ok {
		c.logger.Printf("%s get_chat found no new chats\n", conn.GetInfo())
		return
	}

	chat, err := c.chatsRepository.Create(
		&chats.Chat{
			OrganizerId:   conn.Organizer.Id,
			AgencyId:      conn.Organizer.AgencyId,
			EventId:       chatRequest.EventId,
			ParticipantId: chatRequest.ParticipantId,
			LatStart:      chatRequest.Lat,
			LngStart:      chatRequest.Lng,
			TimeStart:     msg.TimeReceived,
		},
	)

	c.logger.Printf("%s started new chat %s", conn.GetInfo(), chat.Id)
	err = c.chatsManager.SetChatOrganizer(chat.Id, conn)
	if err != nil {
		c.logger.Printf("could not connect %s to chat %s: %s", conn.GetInfo(), chat.Id, err)
		return
	}

	payloadBytes, err := json.Marshal(out.NewChatPayload{Chat: chat})
	if err != nil {
		c.logger.Printf("could not send %s to %s: %s", msg.Type, conn.GetInfo(), err)
		return
	}

	conn.Send(
		&protocol.Message{
			Type:    out.MsgTypeNewChat,
			Payload: payloadBytes,
		},
	)
}