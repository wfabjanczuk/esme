package chats

import (
	"encoding/json"
	"messenger-api/internal/modules/common"
	"messenger-api/internal/modules/infrastructure/messages"
	"messenger-api/internal/modules/ws/protocol"
	"messenger-api/internal/modules/ws/protocol/out"
)

func (m *Manager) WriteMessageToChat(chatId string, message *messages.Message) error {
	m.mu.RLock()
	cc, exists := m.chatChannels[chatId]
	if !exists {
		return common.ErrChatNotFound
	}
	m.mu.RUnlock()

	msg, err := m.messagesRepository.Create(message)
	if err != nil {
		return common.ErrMessageNotCreated
	}

	m.mu.RLock()
	defer m.mu.RUnlock()

	cc, exists = m.chatChannels[chatId]
	if !exists {
		return common.ErrChatNotFound
	}

	outPayloadBytes, err := json.Marshal(out.UserMessagePayload{Message: msg})
	if err != nil {
		return common.ErrMessageNotSent
	}

	outMsg := &protocol.Message{
		Type:    out.MsgTypeUserMessage,
		Payload: outPayloadBytes,
	}
	if cc.OrganizerConnection != nil {
		cc.OrganizerConnection.Send(outMsg)
	}
	if cc.ParticipantConnection != nil {
		cc.ParticipantConnection.Send(outMsg)
	}

	return nil
}
