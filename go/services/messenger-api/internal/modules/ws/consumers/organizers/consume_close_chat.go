package organizers

import (
	"messenger-api/internal/modules/common"
	"messenger-api/internal/modules/ws/connections"
	"messenger-api/internal/modules/ws/protocol/in"
	"messenger-api/internal/modules/ws/protocol/out"
)

func (c *Consumer) consumeCloseChat(msg *connections.OrganizerMessage) {
	id := msg.Source.Organizer.Id
	inPayload, err := in.ParseCloseChatPayload(msg.Message)
	if err != nil {
		c.logger.Printf("organizer %d sent invalid %s payload\n", id, msg.Message.Type)
		msg.Source.SendError(common.ErrInvalidMessagePayload)
		return
	}

	if !c.chatsManager.IsOrganizerInChat(id, inPayload.ChatId) {
		c.logger.Printf("organizer %d has no access to chat %s\n", id, inPayload.ChatId)
		msg.Source.SendError(common.NewErrNoAccessToChat(inPayload.ChatId))
		return
	}

	chatCache, err := c.chatsManager.GetChatCache(inPayload.ChatId)
	if err != nil {
		c.logger.Printf("organizer %d tried to close non-existing chat %s\n", id, inPayload.ChatId)
		msg.Source.SendError(err)
		return
	}

	err = c.chatsRepository.CloseById(inPayload.ChatId)
	if err != nil {
		c.logger.Printf("organizer %d could not close chat %s: %s\n", id, inPayload.ChatId, err)
		msg.Source.SendError(common.ErrChatNotClosed)
		return
	}

	err = c.chatRequestsRepository.DeleteChatRequest(chatCache.ParticipantId, chatCache.EventId)
	if err != nil {
		c.logger.Printf(
			"could not delete chat request lock of participant %d in event %d: %s\n", id, chatCache.EventId, err,
		)
		msg.Source.SendError(common.ErrInternal)
		return
	}

	closedChatMessage, err := out.BuildClosedChat(inPayload.ChatId)
	if err != nil {
		c.logger.Printf("could not send %s to organizer %d: %s\n", out.MsgTypeClosedChat, id, err)
		msg.Source.SendError(common.ErrInternal)
		return
	}

	err = c.chatsManager.SendProtocolMessageToChat(inPayload.ChatId, closedChatMessage)
	if err != nil {
		c.logger.Printf("could not send %s to chat %s: %s\n", out.MsgTypeClosedChat, inPayload.ChatId, err)
		msg.Source.SendError(common.ErrInternal)
		return
	}

	c.chatsManager.RemoveChatCache(inPayload.ChatId)
}
