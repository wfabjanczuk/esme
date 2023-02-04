package chats

import (
	"encoding/json"
	"messenger-api/internal/modules/infrastructure/messages"
	"messenger-api/internal/modules/ws/protocol"
)

func (w *Writer) WriteMessageToChat(chatId string, message *messages.Message) error {
	msg, err := w.messagesRepository.Create(message)
	if err != nil {
		return ErrMessageNotCreated
	}

	w.mu.RLock()
	defer w.mu.RUnlock()

	c, exists := w.chats[chatId]
	if !exists {
		return ErrChatNotFound
	}

	msgBytes, err := json.Marshal(msg)
	if err != nil {
		return ErrMessageNotSent
	}

	outMsg := &protocol.Message{
		Type:    "message",
		Payload: msgBytes,
	}

	if c.OrganizerConnection != nil {
		c.OrganizerConnection.Send(outMsg)
	}
	if c.ParticipantConnection != nil {
		c.ParticipantConnection.Send(outMsg)
	}
	return nil
}
