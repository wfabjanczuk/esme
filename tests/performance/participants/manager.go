package participants

import (
	"log"
	"performance/config"
	"sync"
	"time"
)

type Manager struct {
	config            config.Config
	logWs             bool
	timeStarted       time.Time
	timeEnded         time.Time
	participantsCount int
	chatsCount        int
	errChan           chan error
	doneChan          chan struct{}
	mu                sync.RWMutex
}

func NewManager(config config.Config, logWs bool) *Manager {
	return &Manager{
		config:   config,
		logWs:    logWs,
		errChan:  make(chan error),
		doneChan: make(chan struct{}),
	}
}

func (m *Manager) Stop() {
	log.Println("stopping participants")
	select {
	case <-m.doneChan:
		return
	default:
		m.timeEnded = time.Now()
		close(m.doneChan)
	}
}

func (m *Manager) GetErrChan() chan error {
	return m.errChan
}

func (m *Manager) GetTimeStarted() time.Time {
	return m.timeStarted
}

func (m *Manager) GetDuration() time.Duration {
	return m.timeEnded.Sub(m.timeStarted)
}

func (m *Manager) GetParticipantsCount() int {
	m.mu.RLock()
	defer m.mu.RUnlock()

	return m.participantsCount
}

func (m *Manager) IncrementParticipantsCount() {
	m.mu.Lock()
	defer m.mu.Unlock()

	m.participantsCount++
}

func (m *Manager) GetChatsCount() int {
	m.mu.RLock()
	defer m.mu.RUnlock()

	return m.chatsCount
}

func (m *Manager) IncrementChatsCount() {
	m.mu.Lock()
	defer m.mu.Unlock()

	m.chatsCount++
}

func (m *Manager) StartAddingParticipants(createParticipantInterval, sendMessageInterval time.Duration) {
	m.timeStarted = time.Now()
	for {
		select {
		case <-m.doneChan:
			log.Println("stopping adding participants")
			return
		case <-time.After(createParticipantInterval):
			token, err := m.newParticipantToken(m.participantsCount)
			if err != nil {
				m.errChan <- err
				return
			}

			err = m.newChatRequest(token)
			if err != nil {
				m.errChan <- err
				return
			}

			go m.startConnection(token, sendMessageInterval)
			m.IncrementParticipantsCount()
		}
	}
}
