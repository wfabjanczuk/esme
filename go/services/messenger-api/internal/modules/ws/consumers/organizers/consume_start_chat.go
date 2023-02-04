package organizers

import (
	"messenger-api/internal/modules/common"
	"messenger-api/internal/modules/infrastructure/chats"
	"messenger-api/internal/modules/ws/connections"
	"messenger-api/internal/modules/ws/protocol"
	"messenger-api/internal/modules/ws/protocol/out"
)

func (c *Consumer) consumeStartChat(conn *connections.OrganizerConnection, msg *protocol.Message) {
	chatRequest, ok, err := c.chatRequestsRepository.GetChatRequest(conn.Organizer.AgencyId)
	if err != nil {
		c.logger.Printf("%s get_chat error: %s\n", conn.GetInfo(), err)
		conn.SendError(common.ErrChatRequestNotFetchedFromQueue)
		return
	}
	if !ok {
		c.logger.Printf("%s get_chat found no new chats\n", conn.GetInfo())
		conn.SendInfo(common.InfoNoNewChats)
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
	if err != nil {
		c.logger.Printf("%s get_chat could not create new chat: %s\n", conn.GetInfo(), err)
		conn.SendError(common.ErrChatNotCreated)
		return
	}

	err = c.chatsManager.SetChatOrganizer(chat.Id, conn)
	if err != nil {
		c.logger.Printf("could not connect %s to chat %s: %s\n", conn.GetInfo(), chat.Id, err)
		conn.SendError(common.ErrChatNotConnected)
		return
	}

	outMsg, err := out.BuildNewChat(chat)
	if err != nil {
		c.logger.Printf("could not send %s to %s: %s\n", msg.Type, conn.GetInfo(), err)
		conn.SendError(common.ErrInternal)
		return
	}

	conn.Send(outMsg)
	c.logger.Printf("%s started new chat %s\n", conn.GetInfo(), chat.Id)
}
