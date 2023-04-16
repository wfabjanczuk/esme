package users

import (
	"github.com/gorilla/websocket"
	"messenger-api/internal/modules/authentication"
	"messenger-api/internal/modules/ws/layers"
	"messenger-api/internal/modules/ws/layers/users/controllers"
	"messenger-api/internal/modules/ws/protocol"
	"messenger-api/internal/modules/ws/protocol/out"
)

func (m *Manager) SetParticipantConsumer(participantConsumer layers.ParticipantConsumer) {
	m.participantConsumer = participantConsumer
}

func (m *Manager) AddParticipantConnection(
	participant *authentication.Participant, wsConnection *websocket.Conn,
) error {
	m.participantsMu.Lock()
	defer m.participantsMu.Unlock()

	participantController, exists := m.participants[participant.Id]
	if !exists {
		participantController = controllers.NewParticipantController(participant, m.participantConsumer, m.logger)
		m.participants[participant.Id] = participantController
	}

	return participantController.AddConnection(participant, wsConnection)
}

func (m *Manager) SendToParticipant(id int32, outMsg *protocol.Message) {
	m.participantsMu.RLock()
	defer m.participantsMu.RUnlock()

	controller, exists := m.participants[id]
	if exists {
		controller.Send(outMsg)
	}
}

func (m *Manager) SendInfoToParticipant(id int32, info string) {
	outMsg, e := out.BuildInfo(info)
	if e != nil {
		m.logger.Printf("could not parse info for participant %d: %s\n", id, e)
		return
	}
	m.SendToParticipant(id, outMsg)
}

func (m *Manager) SendErrorToParticipant(id int32, err error) {
	outMsg, e := out.BuildError(err)
	if e != nil {
		m.logger.Printf("could not parse error for participant %d: %s\n", id, e)
		return
	}
	m.SendToParticipant(id, outMsg)
}
