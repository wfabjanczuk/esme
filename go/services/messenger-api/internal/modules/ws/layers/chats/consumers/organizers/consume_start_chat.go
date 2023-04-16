package organizers

import (
	"messenger-api/internal/modules/authentication"
	"messenger-api/internal/modules/common"
	"messenger-api/internal/modules/infrastructure/chats"
	"messenger-api/internal/modules/ws/protocol"
	"messenger-api/internal/modules/ws/protocol/out"
)

func (c *Consumer) consumeStartChat(organizer *authentication.Organizer, msg *protocol.Message) {
	chatRequest, ok, err := c.chatRequestsRepository.GetChatRequest(organizer.AgencyId)
	if err != nil {
		c.logger.Printf("organizer %d get_chat error: %s\n", organizer.Id, err)
		c.usersManager.SendErrorToOrganizer(organizer.Id, common.ErrChatRequestNotFetchedFromQueue)
		return
	}
	if !ok {
		c.logger.Printf("organizer %d get_chat found no new chats\n", organizer.Id)
		c.usersManager.SendInfoToOrganizer(organizer.Id, common.InfoNoNewChats)
		return
	}

	chat, err := c.chatsRepository.Create(
		&chats.Chat{
			OrganizerId:   organizer.Id,
			AgencyId:      organizer.AgencyId,
			EventId:       chatRequest.EventId,
			ParticipantId: chatRequest.ParticipantId,
			LatStart:      chatRequest.Lat,
			LngStart:      chatRequest.Lng,
			TimeStart:     msg.TimeReceived,
		},
	)
	if err != nil {
		c.logger.Printf("organizer %d get_chat could not create new chat: %s\n", organizer.Id, err)
		c.usersManager.SendErrorToOrganizer(organizer.Id, common.ErrChatNotCreated)
		return
	}

	c.chatsManager.SetChat(chat.Id, chat.OrganizerId, chat.ParticipantId)

	outMsg, err := out.BuildNewChat(chat)
	if err != nil {
		c.logger.Printf("could not send %s to organizer %d: %s\n", out.MsgTypeNewChat, organizer.Id, err)
		c.usersManager.SendErrorToOrganizer(organizer.Id, common.ErrInternal)
		return
	}

	c.usersManager.SendToOrganizer(organizer.Id, outMsg)
	c.logger.Printf("organizer %d started new chat %s\n", organizer.Id, chat.Id)
}
