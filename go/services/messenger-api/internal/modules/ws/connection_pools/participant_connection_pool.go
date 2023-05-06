package connection_pools

import (
	"fmt"
	"github.com/gorilla/websocket"
	"log"
	"messenger-api/internal/modules/authentication"
	"messenger-api/internal/modules/common"
	"messenger-api/internal/modules/ws/connections"
	"messenger-api/internal/modules/ws/consumers/participants"
	"messenger-api/internal/modules/ws/protocol"
	"messenger-api/internal/modules/ws/protocol/out"
	"sync"
	"time"
)

const participantConnectionPoolTimeout = 30 * time.Second

type ParticipantConnectionPool struct {
	participant         *authentication.Participant
	consumer            *participants.Consumer
	logger              *log.Logger
	connections         map[*connections.ParticipantConnection]struct{}
	connectionMessages  chan *connections.ParticipantMessage
	connectionShutdowns chan *connections.ParticipantConnection
	shutdowns           chan int32
	doneChan            chan struct{}
	mu                  sync.RWMutex
}

func NewParticipantConnectionPool(
	participant *authentication.Participant, consumer *participants.Consumer, shutdowns chan int32, logger *log.Logger,
) *ParticipantConnectionPool {
	pcp := &ParticipantConnectionPool{
		participant:         participant,
		consumer:            consumer,
		logger:              logger,
		connections:         make(map[*connections.ParticipantConnection]struct{}),
		connectionMessages:  make(chan *connections.ParticipantMessage, 10),
		connectionShutdowns: make(chan *connections.ParticipantConnection, 10),
		shutdowns:           shutdowns,
		doneChan:            make(chan struct{}),
	}

	go pcp.listenOnMessages()
	go pcp.listenOnShutdowns()
	return pcp
}

func (pcp *ParticipantConnectionPool) listenOnMessages() {
	for {
		select {
		case <-pcp.doneChan:
			pcp.logger.Printf("stopped listening on messages for %s\n", pcp.GetInfo())
			return
		case msg := <-pcp.connectionMessages:
			go pcp.consumer.ConsumeMessage(msg)
		}
	}
}

func (pcp *ParticipantConnectionPool) listenOnShutdowns() {
	for {
		select {
		case <-pcp.doneChan:
			pcp.logger.Printf("stopped listening on shutdowns for %s\n", pcp.GetInfo())
			return
		case conn := <-pcp.connectionShutdowns:
			go pcp.removeConnection(conn)
		}
	}
}

func (pcp *ParticipantConnectionPool) AddConnection(
	participant *authentication.Participant, wsConnection *websocket.Conn,
) error {
	select {
	case <-pcp.doneChan:
		return common.ErrConnectionPoolClosing
	default:
	}

	participantConn, err := connections.NewParticipantConnection(
		participant, wsConnection, pcp.connectionMessages, pcp.connectionShutdowns, pcp.logger,
	)
	if err != nil {
		return err
	}
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

	if len(pcp.connections) > 0 {
		return
	}

	time.AfterFunc(
		participantConnectionPoolTimeout,
		func() {
			pcp.mu.Lock()
			defer pcp.mu.Unlock()

			if len(pcp.connections) == 0 {
				pcp.logger.Printf("starting to close connection pool for %s\n", pcp.GetInfo())
				close(pcp.doneChan)
				pcp.shutdowns <- pcp.participant.Id
			}
		},
	)
}

func (pcp *ParticipantConnectionPool) GetInfo() string {
	return fmt.Sprintf("participant %d", pcp.participant.Id)
}

func (pcp *ParticipantConnectionPool) Send(outMsg *protocol.Message) {
	select {
	case <-pcp.doneChan:
		return
	default:
	}

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
