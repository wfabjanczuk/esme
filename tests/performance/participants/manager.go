package participants

import (
	"log"
	"performance/config"
	"sync"
	"time"
)

type Manager struct {
	config              config.Config
	logWs               bool
	timeStarted         time.Time
	timeEnded           time.Time
	participantsCount   int
	chatsCount          int
	messageRates        map[int64]int
	messageTimeSentChan chan int64
	errChan             chan error
	doneChan            chan struct{}
	mu                  sync.RWMutex
}

func NewManager(config config.Config, logWs bool) *Manager {
	return &Manager{
		config:              config,
		logWs:               logWs,
		messageRates:        make(map[int64]int),
		messageTimeSentChan: make(chan int64, 10000),
		errChan:             make(chan error),
		doneChan:            make(chan struct{}),
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

func (m *Manager) GetMessageRates() map[int64]int {
	return m.messageRates
}

func (m *Manager) GetParticipantsCount() int {
	m.mu.RLock()
	defer m.mu.RUnlock()

	return m.participantsCount
}

func (m *Manager) incrementParticipantsCount() {
	m.mu.Lock()
	defer m.mu.Unlock()

	m.participantsCount++
}

func (m *Manager) GetChatsCount() int {
	m.mu.RLock()
	defer m.mu.RUnlock()

	return m.chatsCount
}

func (m *Manager) incrementChatsCount() {
	m.mu.Lock()
	defer m.mu.Unlock()

	m.chatsCount++
}

func (m *Manager) registerMessageSent(timeSentUnix int64) {
	m.messageTimeSentChan <- timeSentUnix
}

func (m *Manager) StartAddingParticipants(createParticipantInterval, sendMessageInterval time.Duration) {
	m.timeStarted = time.Now()
	go m.startMessageRateTracker()

	for {
		select {
		case <-m.doneChan:
			log.Println("stopping adding participants")
			return
		case <-time.After(createParticipantInterval):
			token, err := m.newParticipantToken(m.participantsCount + 1)
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
			m.incrementParticipantsCount()

			if createParticipantInterval == 0 {
				return
			}
		}
	}
}

func (m *Manager) startMessageRateTracker() {
	for {
		select {
		case <-m.doneChan:
			log.Println("stopping message rate tracker")
			return
		case timeSent := <-m.messageTimeSentChan:
			m.messageRates[timeSent]++
		}
	}
}
