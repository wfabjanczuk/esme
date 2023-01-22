package input

import (
	"errors"
	"fmt"
	"github.com/gorilla/websocket"
	"messenger/internal/modules/api/connections"
	"messenger/internal/modules/storage/messages"
	"os"
	"time"
)

type wsRequest struct {
	Payload string `json:"payload"`
}

type task struct {
	ChatID       string
	Payload      string
	TimeReceived time.Time
}

func (m *Manager) listenOnClientConnection(conn *connections.ClientConnection) {
	defer func() {
		if r := recover(); r != nil {
			m.logger.Println("Error", fmt.Sprintf("%v", r))
		}
	}()

	for {
		var request wsRequest
		err := conn.WS.ReadJSON(&request)
		if err != nil {
			if os.IsTimeout(err) {
				m.logger.Printf("Client %s timeout\n", conn.WS.RemoteAddr())
				conn.Close()
				return
			}
			var closeError *websocket.CloseError
			if errors.As(err, &closeError) {
				m.logger.Printf("Close error: %s", err)
				return
			}
			m.logger.Printf("Unexpected error: %s", err)
		} else {
			conn.ResetReadTimer()
			m.logger.Printf("New message from client %s, payload: \"%s\"\n",
				conn.WS.RemoteAddr(),
				request.Payload,
			)
			go m.handleTask(task{
				ChatID:       "63cd2f21eeb503c123b473d4",
				Payload:      request.Payload,
				TimeReceived: time.Now(),
			})
		}
	}
}

func (m *Manager) handleTask(task task) {
	newMessage := &messages.Message{
		ChatID:        task.ChatID,
		Content:       task.Payload,
		FromOrganizer: 1,
		AuthorID:      1,
		TimeSent:      task.TimeReceived,
	}
	err := m.outputManager.SendInChat(task.ChatID, newMessage)
	if err != nil {
		m.logger.Println(err)
	}
}
