package organizer

import (
	"fmt"
	"github.com/gorilla/websocket"
	"time"
)

const startChatInterval = 1 * time.Second

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

func (m *Manager) startConnection(token string) {
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

	for range time.Tick(startChatInterval) {
		err = conn.WriteJSON(m.getWsStartChatDto())
		if err != nil {
			m.errChan <- fmt.Errorf("%s: error sending authorization message: %s", url, err)
			return
		}
	}
}
