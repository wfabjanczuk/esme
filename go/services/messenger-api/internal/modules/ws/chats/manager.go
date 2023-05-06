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
	"messenger-api/internal/modules/ws/protocol"
	"messenger-api/internal/modules/ws/protocol/out"
	"messenger-api/internal/modules/ws/users"
	"sync"
)

type Manager struct {
	chatsRepository     *chats.Repository
	messagesRepository  *messages.Repository
	organizersManager   *users.OrganizersManager
	participantsManager *users.ParticipantsManager
	chats               map[string]layers.ChatCache
	logger              *log.Logger
	mu                  sync.RWMutex
}

func NewManager(
	infra *infrastructure.Module, organizersManager *users.OrganizersManager,
	participantsManager *users.ParticipantsManager, logger *log.Logger,
) *Manager {
	return &Manager{
		chatsRepository:     infra.ChatsRepository,
		messagesRepository:  infra.MessagesRepository,
		organizersManager:   organizersManager,
		participantsManager: participantsManager,
		chats:               make(map[string]layers.ChatCache),
		logger:              logger,
		mu:                  sync.RWMutex{},
	}
}

func (m *Manager) GetOrganizersManager() layers.OrganizersManager {
	return m.organizersManager
}

func (m *Manager) GetParticipantsManager() layers.ParticipantsManager {
	return m.participantsManager
}

func (m *Manager) AddOrganizerConnection(organizer *authentication.Organizer, wsConnection *websocket.Conn) error {
	organizerChats, err := m.chatsRepository.FindAllByOrganizerId(organizer.Id)
	if err != nil {
		return err
	}

	for _, chat := range organizerChats {
		m.SetChat(chat.Id, chat.OrganizerId, chat.ParticipantId, chat.EventId)
	}

	return m.organizersManager.AddConnection(organizer, wsConnection)
}

func (m *Manager) AddParticipantConnection(
	participant *authentication.Participant, wsConnection *websocket.Conn,
) error {
	participantChats, err := m.chatsRepository.FindAllByParticipantId(participant.Id)
	if err != nil {
		return err
	}

	for _, chat := range participantChats {
		m.SetChat(chat.Id, chat.OrganizerId, chat.ParticipantId, chat.EventId)
	}

	return m.participantsManager.AddConnection(participant, wsConnection)
}

func (m *Manager) SetChat(chatId string, organizerId, participantId, eventId int32) {
	m.mu.Lock()
	defer m.mu.Unlock()

	_, exists := m.chats[chatId]
	if !exists {
		m.chats[chatId] = layers.ChatCache{
			ChatId:        chatId,
			EventId:       eventId,
			OrganizerId:   organizerId,
			ParticipantId: participantId,
		}
	}
}

func (m *Manager) CloseChat(chatId string) {
	m.mu.Lock()
	defer m.mu.Unlock()

	delete(m.chats, chatId)
}

func (m *Manager) GetChatCache(chatId string) (layers.ChatCache, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	c, exists := m.chats[chatId]
	if !exists {
		return c, common.ErrChatNotFound
	}

	return c, nil
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

	go m.organizersManager.Send(c.OrganizerId, outMsg)
	go m.participantsManager.Send(c.ParticipantId, outMsg)
	return nil
}

func (m *Manager) SendProtocolMessageToChat(chat *chats.Chat, protocolMessage *protocol.Message) error {
	go m.organizersManager.Send(chat.OrganizerId, protocolMessage)
	go m.participantsManager.Send(chat.ParticipantId, protocolMessage)
	return nil
}
