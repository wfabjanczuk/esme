package participants

import (
	"messenger-api/internal/modules/common"
	"messenger-api/internal/modules/ws/layers/consumers/protocol/out"
)

func (c *Consumer) consumeGetChats(id int32) {
	participantChats, err := c.chatsRepository.FindAllByParticipantId(id)
	if err != nil {
		c.logger.Printf("participant %d could not fetch chats: %s\n", id, err)
		c.participantsManager.SendErrorToParticipant(id, common.ErrChatsNotFetchedFromDb)
		return
	}

	outMsg, err := out.BuildChats(participantChats)
	if err != nil {
		c.logger.Printf("could not send %s to participant %d: %s\n", out.MsgTypeChats, id, err)
		c.participantsManager.SendErrorToParticipant(id, common.ErrInternal)
		return
	}

	c.participantsManager.SendToParticipant(id, outMsg)
}
