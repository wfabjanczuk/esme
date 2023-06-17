package organizer

import (
	"fmt"
	"github.com/gorilla/websocket"
	"log"
	"time"
)

func (m *Manager) getWsAuthorizationDto(token string) wsAuthorizationDto {
	return wsAuthorizationDto{
		Authorization: fmt.Sprintf("Bearer %s", token),
	}
}

func (m *Manager) getWsStartChatDto() wsStartChatDto {
	return wsStartChatDto{
		Type:    "start_chat",
		Payload: "",
	}
}

func (m *Manager) startConnection(token string, startChatInterval time.Duration) {
	m.timeStarted = time.Now()
	var conn *websocket.Conn
	defer func() {
		if r := recover(); r != nil {
			log.Printf("organizer connection %s: recovered from panic: %s", conn.LocalAddr(), r)
		}
	}()

	url := fmt.Sprintf("%s/connect", m.config.MessengerWsUrl)
	conn, _, err := websocket.DefaultDialer.Dial(url, nil)
	if err != nil {
		m.errChan <- fmt.Errorf("%s: could not connect to websocket: %s", url, err)
		return
	}
	defer conn.Close()

	err = conn.WriteJSON(m.getWsAuthorizationDto(token))
	if err != nil {
		m.errChan <- fmt.Errorf("%s: error sending authorization message: %s", url, err)
		return
	}

	for {
		select {
		case <-m.doneChan:
			log.Println("stopping starting chats")
			return
		case <-time.After(startChatInterval):
			dto := m.getWsStartChatDto()
			if m.logWs {
				log.Printf("organizer connection %s: sending start chat message", conn.LocalAddr())
			}

			err = conn.WriteJSON(dto)
			if err != nil {
				m.errChan <- fmt.Errorf("%s: error sending authorization message: %s", url, err)
				return
			}
		}
	}
}
