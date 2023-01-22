package input

import (
	"github.com/gorilla/websocket"
	"messenger/internal/modules/api/connections"
	"net/http"
)

var wsUpgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

func (m *Manager) InitConnection(w http.ResponseWriter, r *http.Request) {
	wsConnection, err := wsUpgrader.Upgrade(w, r, nil)
	if err != nil {
		m.logger.Println(err)
		return
	}
	m.logger.Printf("Client %s connected\n", wsConnection.RemoteAddr())

	user, err := m.authenticator.AuthenticateRequest(r)
	if err != nil {
		m.logger.Println(err)
		wsConnection.Close()
		return
	}
	m.logger.Println(user)

	conn, err := connections.NewClientConnection(wsConnection)
	if err != nil {
		m.logger.Println(err)
		wsConnection.Close()
		return
	}

	chats, err := m.chatsRepository.FindAll()
	if err != nil {
		m.logger.Println(err)
		wsConnection.Close()
		return
	}

	for _, chat := range chats {
		err = m.outputManager.CreateChatIfNotExists(chat.ID)
		if err != nil {
			m.logger.Println(err)
			wsConnection.Close()
			return
		}
		if user.IsOrganizer() {
			err = m.outputManager.SetOrganizerInChat(chat.ID, user.ID(), conn)
		} else {
			err = m.outputManager.SetParticipantInChat(chat.ID, user.ID(), conn)
		}
		if err != nil {
			m.logger.Println(err)
			wsConnection.Close()
			return
		}
	}

	go m.listenOnClientConnection(conn)
}
