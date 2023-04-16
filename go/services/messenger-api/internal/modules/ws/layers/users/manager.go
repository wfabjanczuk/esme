package users

import (
	"log"
	"messenger-api/internal/modules/ws/layers"
	"messenger-api/internal/modules/ws/layers/users/controllers"
	"sync"
)

type Manager struct {
	organizerConsumer   layers.OrganizerConsumer
	participantConsumer layers.ParticipantConsumer
	organizers          map[int32]*controllers.OrganizerController
	participants        map[int32]*controllers.ParticipantController
	logger              *log.Logger
	organizersMu        sync.RWMutex
	participantsMu      sync.RWMutex
}

func NewManager(logger *log.Logger) *Manager {
	return &Manager{
		organizers:   make(map[int32]*controllers.OrganizerController),
		participants: make(map[int32]*controllers.ParticipantController),
		logger:       logger,
	}
}
