package users

import (
	"messenger-api/internal/modules/authentication"
	"messenger-api/internal/modules/ws/layers/connections"
	"messenger-api/internal/modules/ws/protocol"
	"sync"
)

type participantManager struct {
	participant *authentication.Participant
	connections map[*connections.ParticipantConnection]struct{}
	messages    chan *protocol.Message
	done        chan struct{}
	mu          sync.RWMutex
}

func newParticipantManager(participant *authentication.Participant) *participantManager {
	return &participantManager{
		participant: participant,
		connections: make(map[*connections.ParticipantConnection]struct{}),
		messages:    make(chan *protocol.Message, 10),
		done:        make(chan struct{}),
	}
}

func (pm *participantManager) addConnection(participantConnection *connections.ParticipantConnection) {
	pm.mu.Lock()
	defer pm.mu.Unlock()

	pm.connections[participantConnection] = struct{}{}
}
