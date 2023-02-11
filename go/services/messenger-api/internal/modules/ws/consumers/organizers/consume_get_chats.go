package organizers

import (
	"messenger-api/internal/modules/common"
	"messenger-api/internal/modules/ws/connections"
	"messenger-api/internal/modules/ws/protocol/out"
)

func (c *Consumer) consumeGetChats(conn *connections.OrganizerConnection) {
	organizerChats, err := c.chatsRepository.FindAllByOrganizerId(conn.Organizer.Id)
	if err != nil {
		c.logger.Printf("%s could not fetch chats: %s\n", conn.GetInfo(), err)
		conn.SendError(common.ErrChatsNotFetchedFromDb)
		return
	}

	outMsg, err := out.BuildChats(organizerChats)
	if err != nil {
		c.logger.Printf("could not send %s to %s: %s\n", out.MsgTypeChats, conn.GetInfo(), err)
		conn.SendError(common.ErrInternal)
		return
	}

	conn.Send(outMsg)
}
