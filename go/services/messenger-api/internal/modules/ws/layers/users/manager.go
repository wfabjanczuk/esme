package users

import (
	"fmt"
	"github.com/gorilla/websocket"
	"log"
	"messenger-api/internal/modules/authentication"
	"messenger-api/internal/modules/ws/layers/connections"
	"sync"
)

type Manager struct {
	organizers     map[int32]*organizerManager
	participants   map[int32]*participantManager
	logger         *log.Logger
	organizersMu   sync.RWMutex
	participantsMu sync.RWMutex
}

func NewManager(logger *log.Logger) *Manager {
	return &Manager{
		organizers:   make(map[int32]*organizerManager),
		participants: make(map[int32]*participantManager),
		logger:       logger,
	}
}

func (m *Manager) AddOrganizerConnection(organizer *authentication.Organizer, wsConnection *websocket.Conn) error {
	m.organizersMu.Lock()
	defer m.organizersMu.Unlock()

	organizerMan, exists := m.organizers[organizer.Id]
	if !exists {
		organizerMan = newOrganizerManager(organizer)
		m.organizers[organizer.Id] = organizerMan
	}

	organizerConn, err := connections.NewOrganizerConnection(organizer, wsConnection, organizerMan.messages, m.logger)
	if err != nil {
		return err
	}

	organizerMan.addConnection(organizerConn)
	organizerConn.SendInfo(fmt.Sprintf("%s successfully connected", organizerConn.GetInfo()))
	return nil
}

func (m *Manager) AddParticipantConnection(
	participant *authentication.Participant, wsConnection *websocket.Conn,
) error {
	m.participantsMu.Lock()
	defer m.participantsMu.Unlock()

	participantMan, exists := m.participants[participant.Id]
	if !exists {
		participantMan = newParticipantManager(participant)
		m.participants[participant.Id] = participantMan
	}

	participantConn, err := connections.NewParticipantConnection(
		participant, wsConnection, participantMan.messages, m.logger,
	)
	if err != nil {
		return err
	}

	participantMan.addConnection(participantConn)
	participantConn.SendInfo(fmt.Sprintf("%s successfully connected", participantConn.GetInfo()))
	return nil
}
