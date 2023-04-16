package controllers

import (
	"fmt"
	"github.com/gorilla/websocket"
	"log"
	"messenger-api/internal/modules/authentication"
	"messenger-api/internal/modules/ws/layers"
	"messenger-api/internal/modules/ws/layers/users/connections"
	"messenger-api/internal/modules/ws/protocol"
	"messenger-api/internal/modules/ws/protocol/out"
	"sync"
)

type OrganizerController struct {
	organizer   *authentication.Organizer
	consumer    layers.OrganizerConsumer
	logger      *log.Logger
	connections map[*connections.OrganizerConnection]struct{}
	messages    chan *protocol.Message
	done        chan struct{}
	mu          sync.RWMutex
}

func NewOrganizerController(
	organizer *authentication.Organizer, consumer layers.OrganizerConsumer, logger *log.Logger,
) *OrganizerController {
	controller := &OrganizerController{
		organizer:   organizer,
		consumer:    consumer,
		logger:      logger,
		connections: make(map[*connections.OrganizerConnection]struct{}),
		messages:    make(chan *protocol.Message, 10),
		done:        make(chan struct{}),
	}

	go controller.listenOnMessages()
	return controller
}

func (oc *OrganizerController) listenOnMessages() {
	for {
		select {
		case <-oc.done:
			oc.mu.Lock()
			for connection := range oc.connections {
				connection.Close()
			}
			oc.mu.Unlock()
			return
		case message := <-oc.messages:
			go oc.consumer.ConsumeMessage(oc.organizer, message)
		}
	}
}

func (oc *OrganizerController) AddConnection(organizer *authentication.Organizer, wsConnection *websocket.Conn) error {
	organizerConn, err := connections.NewOrganizerConnection(organizer, wsConnection, oc.messages, oc.logger)
	if err != nil {
		return err
	}

	organizerConn.SendInfo(fmt.Sprintf("%s successfully connected", organizerConn.GetInfo()))
	oc.logger.Printf("%s opened connection\n", organizerConn.GetInfo())

	oc.mu.Lock()
	defer oc.mu.Unlock()
	oc.connections[organizerConn] = struct{}{}
	return nil
}

func (oc *OrganizerController) GetInfo() string {
	return fmt.Sprintf("organizer %d", oc.organizer.Id)
}

func (oc *OrganizerController) Send(outMsg *protocol.Message) {
	oc.mu.RLock()
	defer oc.mu.RUnlock()

	for connection := range oc.connections {
		go connection.Send(outMsg)
	}
}

func (oc *OrganizerController) SendInfo(info string) {
	outMsg, e := out.BuildInfo(info)
	if e != nil {
		oc.logger.Printf("could not parse info for %s: %s\n", oc.GetInfo(), e)
		return
	}
	oc.Send(outMsg)
}

func (oc *OrganizerController) SendError(err error) {
	outMsg, e := out.BuildError(err)
	if e != nil {
		oc.logger.Printf("could not parse error for %s: %s\n", oc.GetInfo(), e)
		return
	}
	oc.Send(outMsg)
}
