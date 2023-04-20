package organizers

import (
	"messenger-api/internal/modules/common"
	"messenger-api/internal/modules/ws/layers/consumers/protocol/out"
)

func (c *Consumer) consumeGetChats(id int32) {
	organizerChats, err := c.chatsRepository.FindAllByOrganizerId(id)
	if err != nil {
		c.logger.Printf("organizer %d could not fetch chats: %s\n", id, err)
		c.organizersManager.SendErrorToOrganizer(id, common.ErrChatsNotFetchedFromDb)
		return
	}

	outMsg, err := out.BuildChats(organizerChats)
	if err != nil {
		c.logger.Printf("could not send %s to organizer %d: %s\n", out.MsgTypeChats, id, err)
		c.organizersManager.SendErrorToOrganizer(id, common.ErrInternal)
		return
	}

	c.organizersManager.SendToOrganizer(id, outMsg)
}
