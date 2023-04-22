package connection_pools

import (
	"fmt"
	"github.com/gorilla/websocket"
	"log"
	"messenger-api/internal/modules/authentication"
	"messenger-api/internal/modules/ws/connections"
	"messenger-api/internal/modules/ws/layers"
	"messenger-api/internal/modules/ws/protocol"
	"messenger-api/internal/modules/ws/protocol/out"
	"sync"
)

type ParticipantConnectionPool struct {
	participant         *authentication.Participant
	consumer            layers.ParticipantConsumer
	logger              *log.Logger
	connections         map[*connections.ParticipantConnection]struct{}
	connectionMessages  chan *connections.ParticipantMessage
	connectionShutdowns chan *connections.ParticipantConnection
	done                chan struct{}
	mu                  sync.RWMutex
}

func NewParticipantConnectionPool(
	participant *authentication.Participant, consumer layers.ParticipantConsumer, logger *log.Logger,
) *ParticipantConnectionPool {
	pcp := &ParticipantConnectionPool{
		participant:         participant,
		consumer:            consumer,
		logger:              logger,
		connections:         make(map[*connections.ParticipantConnection]struct{}),
		connectionMessages:  make(chan *connections.ParticipantMessage, 10),
		connectionShutdowns: make(chan *connections.ParticipantConnection, 10),
		done:                make(chan struct{}),
	}

	go pcp.listenOnMessages()
	go pcp.listenOnShutdowns()
	return pcp
}

func (pcp *ParticipantConnectionPool) listenOnMessages() {
	for {
		go pcp.consumer.ConsumeMessage(<-pcp.connectionMessages)
	}
}

func (pcp *ParticipantConnectionPool) listenOnShutdowns() {
	for {
		go pcp.removeConnection(<-pcp.connectionShutdowns)
	}
}

func (pcp *ParticipantConnectionPool) AddConnection(
	participant *authentication.Participant, wsConnection *websocket.Conn,
) error {
	participantConn, err := connections.NewParticipantConnection(
		participant, wsConnection, pcp.connectionMessages, pcp.connectionShutdowns, pcp.logger,
	)
	if err != nil {
		return err
	}

	participantConn.SendInfo(fmt.Sprintf("%s successfully connected", participantConn.GetInfo()))
	pcp.logger.Printf("%s opened connection\n", participantConn.GetInfo())

	pcp.mu.Lock()
	defer pcp.mu.Unlock()
	pcp.connections[participantConn] = struct{}{}
	return nil
}

func (pcp *ParticipantConnectionPool) removeConnection(conn *connections.ParticipantConnection) {
	pcp.mu.Lock()
	defer pcp.mu.Unlock()

	delete(pcp.connections, conn)
	pcp.logger.Printf("removed connection of %s", pcp.GetInfo())
}

func (pcp *ParticipantConnectionPool) GetInfo() string {
	return fmt.Sprintf("participant %d", pcp.participant.Id)
}

func (pcp *ParticipantConnectionPool) Send(outMsg *protocol.Message) {
	pcp.mu.RLock()
	defer pcp.mu.RUnlock()

	for connection := range pcp.connections {
		go connection.Send(outMsg)
	}
}

func (pcp *ParticipantConnectionPool) SendInfo(info string) {
	outMsg, e := out.BuildInfo(info)
	if e != nil {
		pcp.logger.Printf("could not parse info for %s: %s\n", pcp.GetInfo(), e)
		return
	}
	pcp.Send(outMsg)
}

func (pcp *ParticipantConnectionPool) SendError(err error) {
	outMsg, e := out.BuildError(err)
	if e != nil {
		pcp.logger.Printf("could not parse error for %s: %s\n", pcp.GetInfo(), e)
		return
	}
	pcp.Send(outMsg)
}
