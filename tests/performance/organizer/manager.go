package organizer

import (
	"log"
	"performance/config"
	"time"
)

type Manager struct {
	config      config.Config
	logWs       bool
	timeStarted time.Time
	errChan     chan error
	doneChan    chan struct{}
}

func NewManager(config config.Config, logWs bool) *Manager {
	return &Manager{
		config:      config,
		logWs:       logWs,
		timeStarted: time.Now(),
		errChan:     make(chan error),
		doneChan:    make(chan struct{}),
	}
}

func (m *Manager) Stop() {
	log.Println("stopping organizer")
	select {
	case <-m.doneChan:
		return
	default:
		close(m.doneChan)
	}
}

func (m *Manager) GetErrChan() chan error {
	return m.errChan
}

func (m *Manager) StartAcceptingChats(startChatInterval time.Duration) error {
	token, err := m.getOrganizerToken()
	if err != nil {
		return err
	}

	go m.startConnection(token, startChatInterval)
	return nil
}
