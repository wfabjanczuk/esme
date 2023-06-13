package participants

import (
	"performance/config"
	"time"
)

type Manager struct {
	config            config.Config
	errChan           chan error
	timeStarted       time.Time
	participantsCount int
}

func NewManager(config config.Config) *Manager {
	return &Manager{
		config:            config,
		errChan:           make(chan error),
		timeStarted:       time.Now(),
		participantsCount: 0,
	}
}

func (m *Manager) GetErrChan() chan error {
	return m.errChan
}

func (m *Manager) AddParticipant() error {
	token, err := m.newParticipantToken(m.participantsCount)
	if err != nil {
		return err
	}

	err = m.newChatRequest(token)
	if err != nil {
		return err
	}

	go m.startConnection(token)
	m.participantsCount++
	return nil
}
