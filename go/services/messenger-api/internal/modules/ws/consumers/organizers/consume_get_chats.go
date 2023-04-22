package organizers

import (
	"messenger-api/internal/modules/common"
	"messenger-api/internal/modules/ws/connections"
	"messenger-api/internal/modules/ws/protocol/out"
)

func (c *Consumer) consumeGetChats(msg *connections.OrganizerMessage) {
	id := msg.Source.Organizer.Id
	organizerChats, err := c.chatsRepository.FindAllByOrganizerId(id)
	if err != nil {
		c.logger.Printf("organizer %d could not fetch chats: %s\n", id, err)
		msg.Source.SendError(common.ErrChatsNotFetchedFromDb)
		return
	}

	outMsg, err := out.BuildChats(organizerChats)
	if err != nil {
		c.logger.Printf("could not send %s to organizer %d: %s\n", out.MsgTypeChats, id, err)
		msg.Source.SendError(common.ErrInternal)
		return
	}

	msg.Source.Send(outMsg)
}
