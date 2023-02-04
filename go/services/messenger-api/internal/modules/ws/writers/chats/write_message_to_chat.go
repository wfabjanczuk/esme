package chats

import (
	"encoding/json"
	"messenger-api/internal/modules/common"
	"messenger-api/internal/modules/infrastructure/messages"
	"messenger-api/internal/modules/ws/protocol"
	"messenger-api/internal/modules/ws/protocol/organizers/out"
)

func (w *Writer) WriteMessageToChat(chatId string, message *messages.Message) error {
	msg, err := w.messagesRepository.Create(message)
	if err != nil {
		return common.ErrMessageNotCreated
	}

	w.mu.RLock()
	defer w.mu.RUnlock()

	c, exists := w.chats[chatId]
	if !exists {
		return common.ErrChatNotFound
	}

	outPayloadBytes, err := json.Marshal(out.UserMessagePayload{Message: msg})
	if err != nil {
		return common.ErrMessageNotSent
	}

	outMsg := &protocol.Message{
		Type:    out.UserMessage,
		Payload: outPayloadBytes,
	}
	if c.OrganizerConnection != nil {
		c.OrganizerConnection.Send(outMsg)
	}
	if c.ParticipantConnection != nil {
		c.ParticipantConnection.Send(outMsg)
	}

	return nil
}
