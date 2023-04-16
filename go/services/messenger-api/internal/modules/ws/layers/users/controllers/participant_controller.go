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

type ParticipantController struct {
	participant *authentication.Participant
	consumer    layers.ParticipantConsumer
	logger      *log.Logger
	connections map[*connections.ParticipantConnection]struct{}
	messages    chan *protocol.Message
	done        chan struct{}
	mu          sync.RWMutex
}

func NewParticipantController(
	participant *authentication.Participant, consumer layers.ParticipantConsumer, logger *log.Logger,
) *ParticipantController {
	controller := &ParticipantController{
		participant: participant,
		consumer:    consumer,
		logger:      logger,
		connections: make(map[*connections.ParticipantConnection]struct{}),
		messages:    make(chan *protocol.Message, 10),
		done:        make(chan struct{}),
	}

	go controller.listenOnMessages()
	return controller
}

func (pc *ParticipantController) listenOnMessages() {
	for {
		select {
		case <-pc.done:
			pc.mu.Lock()
			for connection := range pc.connections {
				connection.Close()
			}
			pc.mu.Unlock()
			return
		case message := <-pc.messages:
			go pc.consumer.ConsumeMessage(pc.participant, message)
		}
	}
}

func (pc *ParticipantController) AddConnection(
	participant *authentication.Participant, wsConnection *websocket.Conn,
) error {
	participantConn, err := connections.NewParticipantConnection(participant, wsConnection, pc.messages, pc.logger)
	if err != nil {
		return err
	}

	participantConn.SendInfo(fmt.Sprintf("%s successfully connected", participantConn.GetInfo()))
	pc.logger.Printf("%s opened connection\n", participantConn.GetInfo())

	pc.mu.Lock()
	defer pc.mu.Unlock()
	pc.connections[participantConn] = struct{}{}
	return nil
}

func (pc *ParticipantController) GetInfo() string {
	return fmt.Sprintf("participant %d", pc.participant.Id)
}

func (pc *ParticipantController) Send(outMsg *protocol.Message) {
	pc.mu.RLock()
	defer pc.mu.RUnlock()

	for connection := range pc.connections {
		go connection.Send(outMsg)
	}
}

func (pc *ParticipantController) SendInfo(info string) {
	outMsg, e := out.BuildInfo(info)
	if e != nil {
		pc.logger.Printf("could not parse info for %s: %s\n", pc.GetInfo(), e)
		return
	}
	pc.Send(outMsg)
}

func (pc *ParticipantController) SendError(err error) {
	outMsg, e := out.BuildError(err)
	if e != nil {
		pc.logger.Printf("could not parse error for %s: %s\n", pc.GetInfo(), e)
		return
	}
	pc.Send(outMsg)
}
