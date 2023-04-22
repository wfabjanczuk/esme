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

type OrganizerConnectionPool struct {
	organizer   *authentication.Organizer
	consumer    layers.OrganizerConsumer
	logger      *log.Logger
	connections map[*connections.OrganizerConnection]struct{}
	messages    chan *connections.OrganizerMessage
	done        chan struct{}
	mu          sync.RWMutex
}

func NewOrganizerConnectionPool(
	organizer *authentication.Organizer, consumer layers.OrganizerConsumer, logger *log.Logger,
) *OrganizerConnectionPool {
	ocp := &OrganizerConnectionPool{
		organizer:   organizer,
		consumer:    consumer,
		logger:      logger,
		connections: make(map[*connections.OrganizerConnection]struct{}),
		messages:    make(chan *connections.OrganizerMessage, 10),
		done:        make(chan struct{}),
	}

	go ocp.listenOnMessages()
	return ocp
}

func (ocp *OrganizerConnectionPool) listenOnMessages() {
	for {
		select {
		case <-ocp.done:
			ocp.mu.Lock()
			for connection := range ocp.connections {
				connection.Close()
			}
			ocp.mu.Unlock()
			return
		case message := <-ocp.messages:
			go ocp.consumer.ConsumeMessage(message)
		}
	}
}

func (ocp *OrganizerConnectionPool) AddConnection(
	organizer *authentication.Organizer, wsConnection *websocket.Conn,
) error {
	organizerConn, err := connections.NewOrganizerConnection(organizer, wsConnection, ocp.messages, ocp.logger)
	if err != nil {
		return err
	}

	organizerConn.SendInfo(fmt.Sprintf("%s successfully connected", organizerConn.GetInfo()))
	ocp.logger.Printf("%s opened connection\n", organizerConn.GetInfo())

	ocp.mu.Lock()
	defer ocp.mu.Unlock()
	ocp.connections[organizerConn] = struct{}{}
	return nil
}

func (ocp *OrganizerConnectionPool) GetInfo() string {
	return fmt.Sprintf("organizer %d", ocp.organizer.Id)
}

func (ocp *OrganizerConnectionPool) Send(outMsg *protocol.Message) {
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
