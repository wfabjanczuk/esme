package users

import (
	"github.com/gorilla/websocket"
	"log"
	"messenger-api/internal/modules/authentication"
	"messenger-api/internal/modules/ws/connection_pools"
	"messenger-api/internal/modules/ws/consumers/organizers"
	"messenger-api/internal/modules/ws/protocol"
	"messenger-api/internal/modules/ws/protocol/out"
	"sync"
)

type OrganizersManager struct {
	organizerConnectionPools map[int32]*connection_pools.OrganizerConnectionPool
	connectionPoolShutdowns  chan int32
	organizerConsumer        *organizers.Consumer
	logger                   *log.Logger
	mu                       sync.RWMutex
}

func NewOrganizersManager(logger *log.Logger) *OrganizersManager {
	om := &OrganizersManager{
		organizerConnectionPools: make(map[int32]*connection_pools.OrganizerConnectionPool),
		connectionPoolShutdowns:  make(chan int32, 10),
		logger:                   logger,
	}

	go om.listenOnShutdowns()
	return om
}

func (om *OrganizersManager) listenOnShutdowns() {
	for {
		go om.removeConnectionPool(<-om.connectionPoolShutdowns)
	}
}

func (om *OrganizersManager) removeConnectionPool(id int32) {
	om.mu.Lock()
	defer om.mu.Unlock()

	delete(om.organizerConnectionPools, id)
	om.logger.Printf("closed connection pool for organizer %d\n", id)
}

func (om *OrganizersManager) SetConsumer(organizerConsumer *organizers.Consumer) {
	om.organizerConsumer = organizerConsumer
}

func (om *OrganizersManager) IsConnected(id int32) bool {
	om.mu.RLock()
	defer om.mu.RUnlock()

	return om.organizerConnectionPools[id] != nil
}

func (om *OrganizersManager) AddConnection(
	organizer *authentication.Organizer, wsConnection *websocket.Conn,
) error {
	om.mu.Lock()
	defer om.mu.Unlock()

	ocp, exists := om.organizerConnectionPools[organizer.Id]
	if !exists {
		ocp = connection_pools.NewOrganizerConnectionPool(
			organizer, om.organizerConsumer, om.connectionPoolShutdowns, om.logger,
		)
		om.organizerConnectionPools[organizer.Id] = ocp
	}

	return ocp.AddConnection(organizer, wsConnection)
}

func (om *OrganizersManager) Send(id int32, outMsg *protocol.Message) {
	om.mu.RLock()
	defer om.mu.RUnlock()

	ocp, exists := om.organizerConnectionPools[id]
	if exists {
		ocp.Send(outMsg)
	}
}

func (om *OrganizersManager) SendInfo(id int32, info string) {
	outMsg, e := out.BuildInfo(info)
	if e != nil {
		om.logger.Printf("could not parse info for organizer %d: %s\n", id, e)
		return
	}
	om.Send(id, outMsg)
}

func (om *OrganizersManager) SendError(id int32, err error) {
	outMsg, e := out.BuildError(err)
	if e != nil {
		om.logger.Printf("could not parse error for organizer %d: %s\n", id, e)
		return
	}
	om.Send(id, outMsg)
}
