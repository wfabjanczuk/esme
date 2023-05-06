package organizers

import (
	"messenger-api/internal/modules/common"
	"messenger-api/internal/modules/infrastructure/chats"
	"messenger-api/internal/modules/ws/connections"
	"messenger-api/internal/modules/ws/protocol/out"
)

func (c *Consumer) consumeStartChat(msg *connections.OrganizerMessage) {
	organizer := msg.Source.Organizer
	chatRequest, ok, err := c.chatRequestsRepository.GetChatRequest(organizer.AgencyId)
	if err != nil {
		c.logger.Printf("organizer %d get_chat error: %s\n", organizer.Id, err)
		msg.Source.SendError(common.ErrChatRequestNotFetchedFromQueue)
		return
	}
	if !ok {
		c.logger.Printf("organizer %d get_chat found no new chats\n", organizer.Id)
		msg.Source.SendInfo(common.InfoNoNewChats)
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
		msg.Source.SendError(common.ErrChatNotCreated)
		return
	}

	c.chatsManager.SetChatCache(chat.Id, chat.OrganizerId, chat.ParticipantId, chat.EventId)

	enrichedChat := c.enrichedChatsService.EnrichWithParticipant([]*chats.Chat{chat})[0]
	outMsg, err := out.BuildNewEnrichedChat(enrichedChat)
	if err != nil {
		c.logger.Printf("could not send %s to chat %d: %s\n", out.MsgTypeNewChat, chat.Id, err)
		msg.Source.SendError(common.ErrInternal)
		return
	}

	err = c.chatsManager.SendProtocolMessageToChat(chat, outMsg)
	if err != nil {
		c.logger.Printf("could not send %s to chat %d: %s\n", out.MsgTypeNewChat, chat.Id, err)
		msg.Source.SendError(common.ErrInternal)
		return
	}
	c.logger.Printf("organizer %d started new chat %s\n", organizer.Id, chat.Id)
}
