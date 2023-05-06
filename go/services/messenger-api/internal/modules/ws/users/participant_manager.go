package users

import (
	"github.com/gorilla/websocket"
	"log"
	"messenger-api/internal/modules/authentication"
	"messenger-api/internal/modules/ws/connection_pools"
	"messenger-api/internal/modules/ws/consumers/participants"
	"messenger-api/internal/modules/ws/protocol"
	"messenger-api/internal/modules/ws/protocol/out"
	"sync"
)

type ParticipantsManager struct {
	participantConnectionPools map[int32]*connection_pools.ParticipantConnectionPool
	connectionPoolShutdowns    chan int32
	participantConsumer        *participants.Consumer
	logger                     *log.Logger
	mu                         sync.RWMutex
}

func NewParticipantsManager(logger *log.Logger) *ParticipantsManager {
	pm := &ParticipantsManager{
		participantConnectionPools: make(map[int32]*connection_pools.ParticipantConnectionPool),
		connectionPoolShutdowns:    make(chan int32, 10),
		logger:                     logger,
	}

	go pm.listenOnShutdowns()
	return pm
}

func (pm *ParticipantsManager) listenOnShutdowns() {
	for {
		go pm.removeConnectionPool(<-pm.connectionPoolShutdowns)
	}
}

func (pm *ParticipantsManager) removeConnectionPool(id int32) {
	pm.mu.Lock()
	defer pm.mu.Unlock()

	delete(pm.participantConnectionPools, id)
	pm.logger.Printf("closed connection pool for participant %d\n", id)
}

func (pm *ParticipantsManager) SetConsumer(participantConsumer *participants.Consumer) {
	pm.participantConsumer = participantConsumer
}

func (pm *ParticipantsManager) IsConnected(id int32) bool {
	pm.mu.RLock()
	defer pm.mu.RUnlock()

	return pm.participantConnectionPools[id] != nil
}

func (pm *ParticipantsManager) AddConnection(
	participant *authentication.Participant, wsConnection *websocket.Conn,
) error {
	pm.mu.Lock()
	defer pm.mu.Unlock()

	pcp, exists := pm.participantConnectionPools[participant.Id]
	if !exists {
		pcp = connection_pools.NewParticipantConnectionPool(
			participant, pm.participantConsumer, pm.connectionPoolShutdowns, pm.logger,
		)
		pm.participantConnectionPools[participant.Id] = pcp
	}

	return pcp.AddConnection(participant, wsConnection)
}

func (pm *ParticipantsManager) Send(id int32, outMsg *protocol.Message) {
	pm.mu.RLock()
	defer pm.mu.RUnlock()

	pcp, exists := pm.participantConnectionPools[id]
	if exists {
		pcp.Send(outMsg)
	}
}

func (pm *ParticipantsManager) SendInfo(id int32, info string) {
	outMsg, e := out.BuildInfo(info)
	if e != nil {
		pm.logger.Printf("could not parse info for participant %d: %s\n", id, e)
		return
	}
	pm.Send(id, outMsg)
}

func (pm *ParticipantsManager) SendError(id int32, err error) {
	outMsg, e := out.BuildError(err)
	if e != nil {
		pm.logger.Printf("could not parse error for participant %d: %s\n", id, e)
		return
	}
	pm.Send(id, outMsg)
}
