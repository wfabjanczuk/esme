package chats

import (
	"github.com/gorilla/websocket"
	"log"
	"messenger-api/internal/modules/authentication"
	"messenger-api/internal/modules/common"
	"messenger-api/internal/modules/infrastructure"
	"messenger-api/internal/modules/infrastructure/chats"
	"messenger-api/internal/modules/infrastructure/messages"
	"messenger-api/internal/modules/ws/layers"
	"messenger-api/internal/modules/ws/layers/chats/consumers/organizers"
	"messenger-api/internal/modules/ws/layers/chats/consumers/participants"
	"messenger-api/internal/modules/ws/protocol"
	"messenger-api/internal/modules/ws/protocol/out"
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
	usersManager       layers.UsersManager
	chats              map[string]*chat
	logger             *log.Logger
	mu                 sync.RWMutex
}

func NewManager(infra *infrastructure.Module, usersManager layers.UsersManager, logger *log.Logger) *Manager {
	m := &Manager{
		chatsRepository:    infra.ChatsRepository,
		messagesRepository: infra.MessagesRepository,
		usersManager:       usersManager,
		chats:              make(map[string]*chat),
		logger:             logger,
		mu:                 sync.RWMutex{},
	}

	usersManager.SetOrganizerConsumer(organizers.NewConsumer(infra, m.usersManager, m, logger))
	usersManager.SetParticipantConsumer(participants.NewConsumer(infra, m.usersManager, m, logger))
	return m
}

func (m *Manager) AddOrganizerConnection(organizer *authentication.Organizer, wsConnection *websocket.Conn) error {
	organizerChats, err := m.chatsRepository.FindAllByOrganizerId(organizer.Id)
	if err != nil {
		return err
	}

	for _, chat := range organizerChats {
		m.SetChat(chat.Id, chat.OrganizerId, chat.ParticipantId)
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
		m.SetChat(chat.Id, chat.OrganizerId, chat.ParticipantId)
	}

	return m.usersManager.AddParticipantConnection(participant, wsConnection)
}

func (m *Manager) SetChat(chatId string, organizerId, participantId int32) {
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

func (m *Manager) IsOrganizerInChat(organizerId int32, chatId string) bool {
	m.mu.RLock()
	defer m.mu.RUnlock()

	c, exists := m.chats[chatId]
	if !exists {
		return false
	}

	return c.OrganizerId == organizerId
}

func (m *Manager) IsParticipantInChat(participantId int32, chatId string) bool {
	m.mu.RLock()
	defer m.mu.RUnlock()

	c, exists := m.chats[chatId]
	if !exists {
		return false
	}

	return c.ParticipantId == participantId
}

func (m *Manager) SendUserMessageToChat(chatId string, message *messages.Message) error {
	m.mu.RLock()
	c, exists := m.chats[chatId]
	m.mu.RUnlock()
	if !exists {
		return common.ErrChatNotFound
	}

	msg, err := m.messagesRepository.Create(message)
	if err != nil {
		return common.ErrMessageNotSaved
	}

	m.mu.RLock()
	c, exists = m.chats[chatId]
	m.mu.RUnlock()
	if !exists {
		return common.ErrChatNotFoundMessageSaved
	}

	outMsg, err := out.BuildUserMessage(msg)
	if err != nil {
		m.logger.Printf("could not build user message: %s", err)
		return common.ErrInternal
	}

	go m.usersManager.SendToOrganizer(c.OrganizerId, outMsg)
	go m.usersManager.SendToParticipant(c.ParticipantId, outMsg)
	return nil
}

func (m *Manager) SendProtocolMessageToChat(chat *chats.Chat, protocolMessage *protocol.Message) error {
	go m.usersManager.SendToOrganizer(chat.OrganizerId, protocolMessage)
	go m.usersManager.SendToParticipant(chat.ParticipantId, protocolMessage)
	return nil
}
