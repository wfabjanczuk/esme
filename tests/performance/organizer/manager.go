package organizer

import (
	"performance/config"
	"time"
)

type Manager struct {
	config      config.Config
	errChan     chan error
	timeStarted time.Time
}

func NewManager(config config.Config) *Manager {
	return &Manager{
		config:      config,
		errChan:     make(chan error),
		timeStarted: time.Now(),
	}
}

func (m *Manager) GetErrChan() chan error {
	return m.errChan
}

func (m *Manager) InitOrganizer() error {
	token, err := m.getOrganizerToken()
	if err != nil {
		return err
	}

	go m.startConnection(token)
	return nil
}
