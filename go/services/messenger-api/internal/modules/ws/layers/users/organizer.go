package users

import (
	"github.com/gorilla/websocket"
	"messenger-api/internal/modules/authentication"
	"messenger-api/internal/modules/ws/layers"
	"messenger-api/internal/modules/ws/layers/users/controllers"
	"messenger-api/internal/modules/ws/protocol"
	"messenger-api/internal/modules/ws/protocol/out"
)

func (m *Manager) SetOrganizerConsumer(organizerConsumer layers.OrganizerConsumer) {
	m.organizerConsumer = organizerConsumer
}

func (m *Manager) AddOrganizerConnection(organizer *authentication.Organizer, wsConnection *websocket.Conn) error {
	m.organizersMu.Lock()
	defer m.organizersMu.Unlock()

	organizerController, exists := m.organizers[organizer.Id]
	if !exists {
		organizerController = controllers.NewOrganizerController(organizer, m.organizerConsumer, m.logger)
		m.organizers[organizer.Id] = organizerController
	}

	return organizerController.AddConnection(organizer, wsConnection)
}

func (m *Manager) SendToOrganizer(id int32, outMsg *protocol.Message) {
	m.organizersMu.RLock()
	defer m.organizersMu.RUnlock()

	controller, exists := m.organizers[id]
	if exists {
		controller.Send(outMsg)
	}
}

func (m *Manager) SendInfoToOrganizer(id int32, info string) {
	outMsg, e := out.BuildInfo(info)
	if e != nil {
		m.logger.Printf("could not parse info for organizer %d: %s\n", id, e)
		return
	}
	m.SendToOrganizer(id, outMsg)
}

func (m *Manager) SendErrorToOrganizer(id int32, err error) {
	outMsg, e := out.BuildError(err)
	if e != nil {
		m.logger.Printf("could not parse error for organizer %d: %s\n", id, e)
		return
	}
	m.SendToOrganizer(id, outMsg)
}
