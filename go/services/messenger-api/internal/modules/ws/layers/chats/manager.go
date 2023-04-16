package chats

import (
	"github.com/gorilla/websocket"
	"log"
	"messenger-api/internal/modules/authentication"
	"messenger-api/internal/modules/infrastructure/chats"
	"messenger-api/internal/modules/infrastructure/messages"
	"messenger-api/internal/modules/ws/layers/users"
	"sync"
)

type chat struct {
	ChatId        string
	OrganizerId   int32
	ParticipantId int32
}

type Manager struct {
	chatsRepository    *chats.Repository
	messagesRepository *messages.Repository
	usersManager       *users.Manager
	chats              map[string]*chat
	logger             *log.Logger
	mu                 sync.RWMutex
}

func NewManager(
	chatsRepository *chats.Repository, messagesRepository *messages.Repository, usersManager *users.Manager,
	logger *log.Logger,
) *Manager {
	return &Manager{
		chatsRepository:    chatsRepository,
		messagesRepository: messagesRepository,
		usersManager:       usersManager,
		chats:              make(map[string]*chat),
		logger:             logger,
		mu:                 sync.RWMutex{},
	}
}

func (m *Manager) AddOrganizerConnection(organizer *authentication.Organizer, wsConnection *websocket.Conn) error {
	organizerChats, err := m.chatsRepository.FindAllByOrganizerId(organizer.Id)
	if err != nil {
		return err
	}

	for _, chat := range organizerChats {
		m.setChat(chat.Id, chat.OrganizerId, chat.ParticipantId)
	}

	return m.usersManager.AddOrganizerConnection(organizer, wsConnection)
}

func (m *Manager) AddParticipantConnection(
	participant *authentication.Participant, wsConnection *websocket.Conn,
) error {
	participantChats, err := m.chatsRepository.FindAllByParticipantId(participant.Id)
	if err != nil {
		return err
	}

	for _, chat := range participantChats {
		m.setChat(chat.Id, chat.OrganizerId, chat.ParticipantId)
	}

	return m.usersManager.AddParticipantConnection(participant, wsConnection)
}

func (m *Manager) setChat(chatId string, organizerId, participantId int32) {
	m.mu.Lock()
	defer m.mu.Unlock()

	_, exists := m.chats[chatId]
	if !exists {
		m.chats[chatId] = &chat{
			ChatId:        chatId,
			OrganizerId:   organizerId,
			ParticipantId: participantId,
		}
	}
}
