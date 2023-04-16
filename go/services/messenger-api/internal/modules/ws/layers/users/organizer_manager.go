package users

import (
	"messenger-api/internal/modules/authentication"
	"messenger-api/internal/modules/ws/layers/connections"
	"messenger-api/internal/modules/ws/protocol"
	"sync"
)

type organizerManager struct {
	organizer   *authentication.Organizer
	connections map[*connections.OrganizerConnection]struct{}
	messages    chan *protocol.Message
	done        chan struct{}
	mu          sync.RWMutex
}

func newOrganizerManager(organizer *authentication.Organizer) *organizerManager {
	return &organizerManager{
		organizer:   organizer,
		connections: make(map[*connections.OrganizerConnection]struct{}),
		messages:    make(chan *protocol.Message, 10),
		done:        make(chan struct{}),
	}
}

func (om *organizerManager) addConnection(organizerConnection *connections.OrganizerConnection) {
	om.mu.Lock()
	defer om.mu.Unlock()

	om.connections[organizerConnection] = struct{}{}
}
