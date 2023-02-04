package participants

import (
	"encoding/json"
	"messenger-api/internal/modules/ws/connections"
	"messenger-api/internal/modules/ws/protocol"
	"messenger-api/internal/modules/ws/protocol/out"
)

func (c *Consumer) consumeGetChats(conn *connections.ParticipantConnection, msg *protocol.Message) {
	participantChats, err := c.chatsRepository.FindAllByParticipantId(conn.Participant.Id)
	if err != nil {
		c.logger.Printf("%s could not fetch chats: %s\n", conn.GetInfo(), err)
		return
	}

	outPayloadBytes, err := json.Marshal(&out.ChatsPayload{Chats: participantChats})
	if err != nil {
		c.logger.Printf("could not send %s to %s: %s\n", msg.Type, conn.GetInfo(), err)
		return
	}

	conn.Send(
		&protocol.Message{
			Type:    out.MsgTypeChats,
			Payload: outPayloadBytes,
		},
	)
}
