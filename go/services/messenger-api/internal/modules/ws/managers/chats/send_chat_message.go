package chats

import (
	"messenger-api/internal/modules/common"
	"messenger-api/internal/modules/infrastructure/messages"
	"messenger-api/internal/modules/ws/protocol/out"
)

func (m *Manager) SendChatMessage(chatId string, message *messages.Message) error {
	m.mu.RLock()
	cc, exists := m.chatChannels[chatId]
	if !exists {
		return common.ErrChatNotFound
	}
	m.mu.RUnlock()

	msg, err := m.messagesRepository.Create(message)
	if err != nil {
		return common.ErrMessageNotSaved
	}

	m.mu.RLock()
	defer m.mu.RUnlock()

	cc, exists = m.chatChannels[chatId]
	if !exists {
		return common.ErrChatNotFoundMessageSaved
	}

	outMsg, err := out.BuildUserMessage(msg)
	if err != nil {
		m.logger.Printf("could not build user message: %s", err)
		return common.ErrInternal
	}

	if cc.OrganizerConnection != nil {
		cc.OrganizerConnection.Send(outMsg)
	}
	if cc.ParticipantConnection != nil {
		cc.ParticipantConnection.Send(outMsg)
	}

	return nil
}
