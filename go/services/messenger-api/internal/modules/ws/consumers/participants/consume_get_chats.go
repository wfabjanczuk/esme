package participants

import (
	"messenger-api/internal/modules/common"
	"messenger-api/internal/modules/ws/connections"
	"messenger-api/internal/modules/ws/protocol/out"
)

func (c *Consumer) consumeGetChats(msg *connections.ParticipantMessage) {
	id := msg.Source.Participant.Id
	participantChats, err := c.chatsRepository.FindAllByParticipantId(id, 0)
	if err != nil {
		c.logger.Printf("participant %d could not fetch chats: %s\n", id, err)
		msg.Source.SendError(common.ErrChatsNotFetchedFromDb)
		return
	}

	outMsg, err := out.BuildChats(participantChats)
	if err != nil {
		c.logger.Printf("could not send %s to participant %d: %s\n", out.MsgTypeChats, id, err)
		msg.Source.SendError(common.ErrInternal)
		return
	}

	msg.Source.Send(outMsg)
}
