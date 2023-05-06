package connection_pools

import (
	"fmt"
	"github.com/gorilla/websocket"
	"log"
	"messenger-api/internal/modules/authentication"
	"messenger-api/internal/modules/common"
	"messenger-api/internal/modules/ws/connections"
	"messenger-api/internal/modules/ws/consumers/organizers"
	"messenger-api/internal/modules/ws/protocol"
	"messenger-api/internal/modules/ws/protocol/out"
	"sync"
	"time"
)

const organizerConnectionPoolTimeout = 30 * time.Second

type OrganizerConnectionPool struct {
	organizer           *authentication.Organizer
	consumer            *organizers.Consumer
	logger              *log.Logger
	connections         map[*connections.OrganizerConnection]struct{}
	connectionMessages  chan *connections.OrganizerMessage
	connectionShutdowns chan *connections.OrganizerConnection
	shutdowns           chan int32
	doneChan            chan struct{}
	mu                  sync.RWMutex
}

func NewOrganizerConnectionPool(
	organizer *authentication.Organizer, consumer *organizers.Consumer, shutdowns chan int32, logger *log.Logger,
) *OrganizerConnectionPool {
	ocp := &OrganizerConnectionPool{
		organizer:           organizer,
		consumer:            consumer,
		logger:              logger,
		connections:         make(map[*connections.OrganizerConnection]struct{}),
		connectionMessages:  make(chan *connections.OrganizerMessage, 10),
		connectionShutdowns: make(chan *connections.OrganizerConnection, 10),
		shutdowns:           shutdowns,
		doneChan:            make(chan struct{}),
	}

	go ocp.listenOnMessages()
	go ocp.listenOnShutdowns()
	return ocp
}

func (ocp *OrganizerConnectionPool) listenOnMessages() {
	for {
		select {
		case <-ocp.doneChan:
			ocp.logger.Printf("stopped listening on messages for %s\n", ocp.GetInfo())
			return
		case msg := <-ocp.connectionMessages:
			go ocp.consumer.ConsumeMessage(msg)
		}
	}
}

func (ocp *OrganizerConnectionPool) listenOnShutdowns() {
	for {
		select {
		case <-ocp.doneChan:
			ocp.logger.Printf("stopped listening on shutdowns for %s\n", ocp.GetInfo())
			return
		case conn := <-ocp.connectionShutdowns:
			go ocp.removeConnection(conn)
		}
	}
}

func (ocp *OrganizerConnectionPool) AddConnection(
	organizer *authentication.Organizer, wsConnection *websocket.Conn,
) error {
	select {
	case <-ocp.doneChan:
		return common.ErrConnectionPoolClosing
	default:
	}

	organizerConn, err := connections.NewOrganizerConnection(
		organizer, wsConnection, ocp.connectionMessages, ocp.connectionShutdowns, ocp.logger,
	)
	if err != nil {
		return err
	}
	ocp.logger.Printf("%s opened connection\n", organizerConn.GetInfo())

	ocp.mu.Lock()
	defer ocp.mu.Unlock()
	ocp.connections[organizerConn] = struct{}{}
	return nil
}

func (ocp *OrganizerConnectionPool) removeConnection(conn *connections.OrganizerConnection) {
	ocp.mu.Lock()
	defer ocp.mu.Unlock()

	delete(ocp.connections, conn)
	ocp.logger.Printf("removed connection of %s", ocp.GetInfo())

	if len(ocp.connections) > 0 {
		return
	}

	time.AfterFunc(
		organizerConnectionPoolTimeout,
		func() {
			ocp.mu.Lock()
			defer ocp.mu.Unlock()

			if len(ocp.connections) == 0 {
				ocp.logger.Printf("starting to close connection pool for %s\n", ocp.GetInfo())
				close(ocp.doneChan)
				ocp.shutdowns <- ocp.organizer.Id
			}
		},
	)
}

func (ocp *OrganizerConnectionPool) GetInfo() string {
	return fmt.Sprintf("organizer %d", ocp.organizer.Id)
}

func (ocp *OrganizerConnectionPool) Send(outMsg *protocol.Message) {
	select {
	case <-ocp.doneChan:
		return
	default:
	}

	ocp.mu.RLock()
	defer ocp.mu.RUnlock()

	for connection := range ocp.connections {
		go connection.Send(outMsg)
	}
}

func (ocp *OrganizerConnectionPool) SendInfo(info string) {
	outMsg, e := out.BuildInfo(info)
	if e != nil {
		ocp.logger.Printf("could not parse info for %s: %s\n", ocp.GetInfo(), e)
		return
	}
	ocp.Send(outMsg)
}

func (ocp *OrganizerConnectionPool) SendError(err error) {
	outMsg, e := out.BuildError(err)
	if e != nil {
		ocp.logger.Printf("could not parse error for %s: %s\n", ocp.GetInfo(), e)
		return
	}
	ocp.Send(outMsg)
}
