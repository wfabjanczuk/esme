package chats

import (
	"log"
	"messenger-api/internal/modules/common"
	"messenger-api/internal/modules/infrastructure/messages"
	"messenger-api/internal/modules/ws/connections"
	"sync"
)

type chatChannel struct {
	ChatId                string
	OrganizerConnection   *connections.OrganizerConnection
	ParticipantConnection *connections.ParticipantConnection
}

type Manager struct {
	messagesRepository *messages.Repository
	chatChannels       map[string]*chatChannel
	organizerChats     map[*connections.OrganizerConnection]map[string]struct{}
	participantChats   map[*connections.ParticipantConnection]map[string]struct{}
	logger             *log.Logger
	mu                 sync.RWMutex
}

func NewManager(messagesRepository *messages.Repository, logger *log.Logger) *Manager {
	return &Manager{
		messagesRepository: messagesRepository,
		chatChannels:       make(map[string]*chatChannel),
		organizerChats:     make(map[*connections.OrganizerConnection]map[string]struct{}),
		participantChats:   make(map[*connections.ParticipantConnection]map[string]struct{}),
		logger:             logger,
		mu:                 sync.RWMutex{},
	}
}

func (m *Manager) getSetChatChannel(chatId string) *chatChannel {
	cc, exists := m.chatChannels[chatId]
	if !exists {
		cc = &chatChannel{
			ChatId: chatId,
		}
		m.chatChannels[chatId] = cc
	}
	return cc
}

func (m *Manager) getSetOrganizerChats(chatId string, conn *connections.OrganizerConnection) map[string]struct{} {
	oChats, exists := m.organizerChats[conn]
	if !exists {
		oChats = make(map[string]struct{})
		m.organizerChats[conn] = oChats
	}
	oChats[chatId] = struct{}{}
	return oChats
}

func (m *Manager) getSetParticipantChats(chatId string, conn *connections.ParticipantConnection) map[string]struct{} {
	pChats, exists := m.participantChats[conn]
	if !exists {
		pChats = make(map[string]struct{})
		m.participantChats[conn] = pChats
	}
	pChats[chatId] = struct{}{}
	return pChats
}

func (m *Manager) SetChatOrganizer(chatId string, conn *connections.OrganizerConnection) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	cc := m.getSetChatChannel(chatId)
	if cc.OrganizerConnection != nil {
		return common.ErrConnectionExists
	}
	cc.OrganizerConnection = conn
	m.getSetOrganizerChats(chatId, conn)
	return nil
}

func (m *Manager) SetChatParticipant(chatId string, conn *connections.ParticipantConnection) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	cc := m.getSetChatChannel(chatId)
	if cc.OrganizerConnection != nil {
		return common.ErrConnectionExists
	}
	cc.ParticipantConnection = conn
	m.getSetParticipantChats(chatId, conn)
	return nil
}

func (m *Manager) HasChatOrganizer(chatId string, conn *connections.OrganizerConnection) bool {
	m.mu.RLock()
	defer m.mu.RUnlock()

	cc, exists := m.chatChannels[chatId]
	if !exists {
		return false
	}

	return cc.OrganizerConnection == conn
}

func (m *Manager) HasChatParticipant(chatId string, conn *connections.ParticipantConnection) bool {
	m.mu.RLock()
	defer m.mu.RUnlock()

	cc, exists := m.chatChannels[chatId]
	if !exists {
		return false
	}

	return cc.ParticipantConnection == conn
}

func (m *Manager) DisconnectOrganizer(conn *connections.OrganizerConnection) {
	m.mu.Lock()
	defer m.mu.Unlock()

	oChats, exists := m.organizerChats[conn]
	if !exists {
		return
	}

	for chatId := range oChats {
		m.removeOrganizerFromChat(chatId)
	}

	m.logger.Printf("disconnected from chats %s\n", conn.GetInfo())
}

func (m *Manager) DisconnectParticipant(conn *connections.ParticipantConnection) {
	m.mu.Lock()
	defer m.mu.Unlock()

	pChats, exists := m.participantChats[conn]
	if !exists {
		return
	}

	for chatId := range pChats {
		m.removeParticipantFromChat(chatId)
	}

	m.logger.Printf("disconnected from chats %s\n", conn.GetInfo())
}

func (m *Manager) removeOrganizerFromChat(chatId string) {
	cc, exists := m.chatChannels[chatId]
	if !exists {
		return
	}

	if cc.ParticipantConnection == nil {
		delete(m.chatChannels, chatId)
		return
	}

	cc.OrganizerConnection = nil
	return
}

func (m *Manager) removeParticipantFromChat(chatId string) {
	cc, exists := m.chatChannels[chatId]
	if !exists {
		return
	}

	if cc.OrganizerConnection == nil {
		delete(m.chatChannels, chatId)
		return
	}

	cc.ParticipantConnection = nil
	return
}
