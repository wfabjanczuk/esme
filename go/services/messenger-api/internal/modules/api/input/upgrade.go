package input

import (
	"github.com/gorilla/websocket"
	"messenger-api/internal/modules/api/connections"
	"net/http"
)

var wsUpgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

func (m *Manager) UpgradeConnection(w http.ResponseWriter, r *http.Request) {
	parseHeaderResult := m.authenticator.ParseHeader(r.Header.Get("Authorization"))
	if parseHeaderResult.Err != nil {
		m.logger.Printf("could not open connection for client %s: %s\n", r.RemoteAddr, parseHeaderResult.Err)
		return
	}

	if parseHeaderResult.IsOrganizer {
		m.upgradeOrganizerConnection(w, r, parseHeaderResult.Token)
	} else {
		m.upgradeParticipantConnection(w, r, parseHeaderResult.Token)
	}
}

func (m *Manager) upgradeOrganizerConnection(w http.ResponseWriter, r *http.Request, token string) {
	organizer, err := m.authenticator.AuthenticateOrganizer(token)
	if err != nil {
		m.logger.Printf("could not authenticate organizer %s: %s\n", r.RemoteAddr, err)
		return
	}

	wsConnection, err := wsUpgrader.Upgrade(w, r, nil)
	if err != nil {
		m.logger.Printf("could not upgrade organizer connection %s: %s\n", r.RemoteAddr, err)
		return
	}
	m.logger.Printf("organizer %s opened connection\n", wsConnection.RemoteAddr())

	conn, err := connections.NewOrganizerConnection(wsConnection, organizer, m.logger)
	if err != nil {
		m.logger.Printf("could not set up organizer connection %s: %s\n", r.RemoteAddr, err)
		wsConnection.Close()
		return
	}

	chats, err := m.chatsRepository.FindAllByOrganizerId(organizer.Id)
	if err != nil {
		m.logger.Printf("could not fetch organizer chats %s: %s\n", r.RemoteAddr, err)
		conn.Close()
		return
	}

	for _, chat := range chats {
		conn.ChatIds = append(conn.ChatIds, chat.Id)
		m.outputManager.SetOrganizerInChat(chat.Id, conn)
	}

	go m.organizersListener.ListenOnConnection(conn)
}

func (m *Manager) upgradeParticipantConnection(w http.ResponseWriter, r *http.Request, token string) {
	participant, err := m.authenticator.AuthenticateParticipant(token)
	if err != nil {
		m.logger.Printf("could not authenticate participant %s: %s\n", r.RemoteAddr, err)
		return
	}

	wsConnection, err := wsUpgrader.Upgrade(w, r, nil)
	if err != nil {
		m.logger.Printf("could not upgrade participant connection %s: %s\n", r.RemoteAddr, err)
		return
	}
	m.logger.Printf("participant %s opened connection\n", wsConnection.RemoteAddr())

	conn, err := connections.NewParticipantConnection(wsConnection, participant, m.logger)
	if err != nil {
		m.logger.Printf("could not set up participant connection %s: %s\n", r.RemoteAddr, err)
		wsConnection.Close()
		return
	}

	chats, err := m.chatsRepository.FindAllByParticipantId(participant.Id)
	if err != nil {
		m.logger.Printf("could not fetch participant chats %s: %s\n", r.RemoteAddr, err)
		conn.Close()
		return
	}

	for _, chat := range chats {
		conn.ChatIds = append(conn.ChatIds, chat.Id)
		m.outputManager.SetParticipantInChat(chat.Id, conn)
	}

	go m.participantsListener.ListenOnConnection(conn)
}
