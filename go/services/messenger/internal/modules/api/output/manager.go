package output

import (
	"errors"
	"messenger/internal/modules/api/connections"
	"messenger/internal/modules/storage/messages"
	"sync"
)

var ErrChatNotFound = errors.New("chat not found")
var ErrMessageNotSent = errors.New("message not sent")

type client struct {
	ID         int32
	Connection *connections.ClientConnection
}

type chat struct {
	ChatID      string
	Organizer   *client
	Participant *client
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

func (m *Manager) CreateChatIfNotExists(chatId string) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	if _, exists := m.chats[chatId]; exists {
		return nil
	}

	m.chats[chatId] = &chat{
		ChatID: chatId,
	}
	return nil
}

func (m *Manager) DeleteChat(chatId string) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	if _, exists := m.chats[chatId]; !exists {
		return ErrChatNotFound
	}

	delete(m.chats, chatId)
	return nil
}

func (m *Manager) SetOrganizerInChat(chatId string, id int32, conn *connections.ClientConnection) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	var channel *chat
	var exists bool
	if channel, exists = m.chats[chatId]; !exists {
		return ErrChatNotFound
	}

	channel.Organizer = &client{
		ID:         id,
		Connection: conn,
	}
	return nil
}

func (m *Manager) SetParticipantInChat(chatId string, id int32, conn *connections.ClientConnection) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	var channel *chat
	var exists bool
	if channel, exists = m.chats[chatId]; !exists {
		return ErrChatNotFound
	}

	channel.Participant = &client{
		ID:         id,
		Connection: conn,
	}
	return nil
}

func (m *Manager) SendInChat(chatId string, message *messages.Message) error {
	m.mu.RLock()
	defer m.mu.RUnlock()

	var chat *chat
	var exists bool
	if chat, exists = m.chats[chatId]; !exists {
		return ErrChatNotFound
	}

	message, err := m.messagesRepository.Create(message)
	if err != nil {
		if message.FromOrganizer == 1 {
			sendErrorMessage(chat.Organizer.Connection, ErrMessageNotSent.Error())
		} else {
			sendErrorMessage(chat.Participant.Connection, ErrMessageNotSent.Error())
		}
		return ErrMessageNotSent
	}

	if chat.Organizer != nil {
		sendSuccessMessage(chat.Organizer.Connection, message.Content)
	}
	if chat.Participant != nil {
		sendSuccessMessage(chat.Participant.Connection, message.Content)
	}
	return nil
}
