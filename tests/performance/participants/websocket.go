package participants

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/websocket"
	"log"
	"time"
)

const (
	participantTimeout = 1 * time.Second
)

func (m *Manager) getWsAuthorizationDto(token string) wsAuthorizationDto {
	return wsAuthorizationDto{
		Authorization: fmt.Sprintf("Bearer %s", token),
	}
}

func (m *Manager) startConnection(token string) {
	url := fmt.Sprintf("%s/connect", m.config.MessengerWsUrl)

	c, _, err := websocket.DefaultDialer.Dial(url, nil)
	if err != nil {
		m.errChan <- fmt.Errorf("%s: could not connect to websocket: %s", url, err)
		return
	}
	defer c.Close()

	authorizationPayload, err := json.Marshal(m.getWsAuthorizationDto(token))
	if err != nil {
		m.errChan <- fmt.Errorf("%s: error marshaling authorization message: %s", url, err)
		return
	}

	err = c.WriteMessage(websocket.TextMessage, authorizationPayload)
	if err != nil {
		m.errChan <- fmt.Errorf("%s: error sending authorization message: %s", url, err)
		return
	}

	chatId, err := m.getChatId(c)
	if err != nil {
		m.errChan <- fmt.Errorf("%s: error getting chat id: %s", url, err)
		return
	}

	log.Println(chatId)
}

func (m *Manager) getWsGetChatsDto() wsGetChatsDto {
	return wsGetChatsDto{
		Type:    "get_chats",
		Payload: "",
	}
}

func (m *Manager) getChatId(conn *websocket.Conn) (string, error) {
	maxRetries := 100
	retry := 1

	for retry <= maxRetries {
		time.Sleep(200 * time.Millisecond)
		retry++

		err := conn.WriteJSON(m.getWsGetChatsDto())
		if err != nil {
			return "", fmt.Errorf("error sending get chats message: %s", err)
		}

		wsResponse := wsResponseDto{}
		err = conn.ReadJSON(&wsResponse)
		if err != nil {
			return "", fmt.Errorf("error reading ws response: %s", err)
		}

		if wsResponse.Type != "chats" {
			continue
		}

		var chatsPayload wsChatsResponsePayload
		err = json.Unmarshal(wsResponse.Payload, &chatsPayload)
		if err != nil {
			return "", fmt.Errorf("error reading ws chats response: %s", err)
		}

		if len(chatsPayload.Chats) == 0 {
			continue
		}

		return chatsPayload.Chats[0].Id, nil
	}

	return "", fmt.Errorf("max retries in getting chat id exceeded: %d", maxRetries)
}

func (m *Manager) startCommunication(conn *websocket.Conn) {
	sendChan := make(chan int)
	sendConfirmationChan := make(chan int, 1)
	sendConfirmationChan <- 0

	messageNumber := 1
	go m.startSending(conn, sendChan, sendConfirmationChan)

	for {
		select {
		case <-sendConfirmationChan:
			sendChan <- messageNumber
			messageNumber++
		case <-time.After(participantTimeout):
			m.errChan <- fmt.Errorf("participant timeout")
		}
	}
}

func (m *Manager) getWsSendMessageDto(chatId string, messageNumber int) wsSendMessageDto {
	return wsSendMessageDto{
		Type: "send_message",
		Payload: wsSendMessagePayload{
			ChatId:  chatId,
			Message: fmt.Sprintf("%s", messageNumber),
		},
	}
}

func (m *Manager) startSending(conn *websocket.Conn, sendChan, sendConfirmationChan chan int) {
	for {
		select {
		case messageNumber := <-sendChan:
			err := conn.WriteJSON(m.getWsSendMessageDto("", messageNumber))
			if err != nil {
				m.errChan <- fmt.Errorf("error sending message: %s", err)
				return
			}
			sendConfirmationChan <- 1
		}
	}
}
