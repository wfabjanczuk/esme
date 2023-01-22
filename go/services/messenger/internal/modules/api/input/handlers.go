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

	conn, err := connections.NewClientConnection(wsConnection)
	if err != nil {
		m.logger.Println(err)
		return
	}

	chats, err := m.chatsRepository.FindAll()
	if err != nil {
		m.logger.Println(err)
		return
	}

	for _, chat := range chats {
		m.outputManager.CreateChat(chat.ID)
		m.outputManager.SetOrganizerInChat(chat.ID, 1, conn)
	}

	go m.listenOnClientConnection(conn)
}
