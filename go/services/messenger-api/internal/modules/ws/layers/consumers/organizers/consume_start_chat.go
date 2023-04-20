package organizers

import (
	"messenger-api/internal/modules/authentication"
	"messenger-api/internal/modules/common"
	"messenger-api/internal/modules/infrastructure/chats"
	"messenger-api/internal/modules/ws/layers/consumers/protocol"
	"messenger-api/internal/modules/ws/layers/consumers/protocol/out"
)

func (c *Consumer) consumeStartChat(organizer *authentication.Organizer, msg *protocol.Message) {
	chatRequest, ok, err := c.chatRequestsRepository.GetChatRequest(organizer.AgencyId)
	if err != nil {
		c.logger.Printf("organizer %d get_chat error: %s\n", organizer.Id, err)
		c.organizersManager.SendErrorToOrganizer(organizer.Id, common.ErrChatRequestNotFetchedFromQueue)
		return
	}
	if !ok {
		c.logger.Printf("organizer %d get_chat found no new chats\n", organizer.Id)
		c.organizersManager.SendInfoToOrganizer(organizer.Id, common.InfoNoNewChats)
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
		c.organizersManager.SendErrorToOrganizer(organizer.Id, common.ErrChatNotCreated)
		return
	}

	c.chatsManager.SetChat(chat.Id, chat.OrganizerId, chat.ParticipantId)

	outMsg, err := out.BuildNewChat(chat)
	if err != nil {
		c.logger.Printf("could not send %s to chat %d: %s\n", out.MsgTypeNewChat, chat.Id, err)
		c.organizersManager.SendErrorToOrganizer(organizer.Id, common.ErrInternal)
		return
	}

	err = c.chatsManager.SendProtocolMessageToChat(chat, outMsg)
	if err != nil {
		c.logger.Printf("could not send %s to chat %d: %s\n", out.MsgTypeNewChat, chat.Id, err)
		c.organizersManager.SendErrorToOrganizer(organizer.Id, common.ErrInternal)
		return
	}
	c.logger.Printf("organizer %d started new chat %s\n", organizer.Id, chat.Id)
}
