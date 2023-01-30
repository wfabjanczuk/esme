package output

import (
	"errors"
	"messenger/internal/modules/api/connections"
	"messenger/internal/modules/infrastructure/messages"
	"sync"
)

var ErrChatNotFound = errors.New("chat not found")
var ErrMessageNotSent = errors.New("message not sent")

type chat struct {
	ChatId                string
	OrganizerConnection   *connections.OrganizerConnection
	ParticipantConnection *connections.ParticipantConnection
}

type Manager struct {
	messagesRepository *messages.MessagesRepository
	chats              map[string]*chat
	mu                 sync.RWMutex
}

func NewManager(messagesRepository *messages.MessagesRepository) *Manager {
	return &Manager{
		messagesRepository: messagesRepository,
		chats:              make(map[string]*chat),
		mu:                 sync.RWMutex{},
	}
}

func (m *Manager) getSetChat(chatId string) *chat {
	c, exists := m.chats[chatId]
	if !exists {
		c = &chat{
			ChatId: chatId,
		}
		m.chats[chatId] = c
	}
	return c
}

func (m *Manager) SetOrganizerInChat(chatId string, conn *connections.OrganizerConnection) {
	m.mu.Lock()
	defer m.mu.Unlock()

	m.getSetChat(chatId).OrganizerConnection = conn
}

func (m *Manager) SetParticipantInChat(chatId string, conn *connections.ParticipantConnection) {
	m.mu.Lock()
	defer m.mu.Unlock()

	m.getSetChat(chatId).ParticipantConnection = conn
}

func (m *Manager) RemoveOrganizerFromChat(chatId string) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	c, exists := m.chats[chatId]
	if !exists {
		return ErrChatNotFound
	}

	if c.ParticipantConnection == nil {
		delete(m.chats, chatId)
		return nil
	}

	c.OrganizerConnection = nil
	return nil
}

func (m *Manager) RemoveParticipantFromChat(chatId string) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	c, exists := m.chats[chatId]
	if !exists {
		return ErrChatNotFound
	}

	if c.OrganizerConnection == nil {
		delete(m.chats, chatId)
		return nil
	}

	c.ParticipantConnection = nil
	return nil
}

func (m *Manager) SendUserMessageInChat(chatId string, message *messages.Message) error {
	m.mu.RLock()
	defer m.mu.RUnlock()

	c, exists := m.chats[chatId]
	if !exists {
		return ErrChatNotFound
	}

	message, err := m.messagesRepository.Create(message)
	if err != nil {
		if message.FromOrganizer == 1 {
			sendErrorMessage(c.OrganizerConnection.Ws, ErrMessageNotSent.Error())
		} else {
			sendErrorMessage(c.ParticipantConnection.Ws, ErrMessageNotSent.Error())
		}
		return ErrMessageNotSent
	}

	if c.OrganizerConnection != nil {
		sendSuccessMessage(c.OrganizerConnection.Ws, message.Content)
	}
	if c.ParticipantConnection != nil {
		sendSuccessMessage(c.ParticipantConnection.Ws, message.Content)
	}
	return nil
}

func (m *Manager) SendSystemMessageInChat(chatId string, message string) error {
	m.mu.RLock()
	defer m.mu.RUnlock()

	c, exists := m.chats[chatId]
	if !exists {
		return ErrChatNotFound
	}

	if c.OrganizerConnection != nil {
		sendSuccessMessage(c.OrganizerConnection.Ws, message)
	}
	if c.ParticipantConnection != nil {
		sendSuccessMessage(c.ParticipantConnection.Ws, message)
	}
	return nil
}

func (m *Manager) SendSystemMessageToOrganizer(chatId string, message string) error {
	m.mu.RLock()
	defer m.mu.RUnlock()

	c, exists := m.chats[chatId]
	if !exists {
		return ErrChatNotFound
	}

	if c.OrganizerConnection != nil {
		sendSuccessMessage(c.OrganizerConnection.Ws, message)
	}
	return nil
}

func (m *Manager) SendSystemMessageToParticipant(chatId string, message string) error {
	m.mu.RLock()
	defer m.mu.RUnlock()

	c, exists := m.chats[chatId]
	if !exists {
		return ErrChatNotFound
	}

	if c.ParticipantConnection != nil {
		sendSuccessMessage(c.ParticipantConnection.Ws, message)
	}
	return nil
}
