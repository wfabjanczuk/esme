package users

import (
	"github.com/gorilla/websocket"
	"log"
	"messenger-api/internal/modules/authentication"
	"messenger-api/internal/modules/ws/layers"
	"messenger-api/internal/modules/ws/layers/connection_pools"
	"messenger-api/internal/modules/ws/layers/consumers/protocol"
	"messenger-api/internal/modules/ws/layers/consumers/protocol/out"
	"sync"
)

type ParticipantsManager struct {
	participantConnectionPools map[int32]*connection_pools.ParticipantConnectionPool
	participantConsumer        layers.ParticipantConsumer
	logger                     *log.Logger
	mu                         sync.RWMutex
}

func NewParticipantsManager(logger *log.Logger) *ParticipantsManager {
	return &ParticipantsManager{
		participantConnectionPools: make(map[int32]*connection_pools.ParticipantConnectionPool),
		logger:                     logger,
	}
}

func (pm *ParticipantsManager) SetParticipantConsumer(participantConsumer layers.ParticipantConsumer) {
	pm.participantConsumer = participantConsumer
}

func (pm *ParticipantsManager) AddParticipantConnection(
	participant *authentication.Participant, wsConnection *websocket.Conn,
) error {
	pm.mu.Lock()
	defer pm.mu.Unlock()

	pcp, exists := pm.participantConnectionPools[participant.Id]
	if !exists {
		pcp = connection_pools.NewParticipantConnectionPool(
			participant, pm.participantConsumer, pm.logger,
		)
		pm.participantConnectionPools[participant.Id] = pcp
	}

	return pcp.AddConnection(participant, wsConnection)
}

func (pm *ParticipantsManager) SendToParticipant(id int32, outMsg *protocol.Message) {
	pm.mu.RLock()
	defer pm.mu.RUnlock()

	pcp, exists := pm.participantConnectionPools[id]
	if exists {
		pcp.Send(outMsg)
	}
}

func (pm *ParticipantsManager) SendInfoToParticipant(id int32, info string) {
	outMsg, e := out.BuildInfo(info)
	if e != nil {
		pm.logger.Printf("could not parse info for participant %d: %s\n", id, e)
		return
	}
	pm.SendToParticipant(id, outMsg)
}

func (pm *ParticipantsManager) SendErrorToParticipant(id int32, err error) {
	outMsg, e := out.BuildError(err)
	if e != nil {
		pm.logger.Printf("could not parse error for participant %d: %s\n", id, e)
		return
	}
	pm.SendToParticipant(id, outMsg)
}
