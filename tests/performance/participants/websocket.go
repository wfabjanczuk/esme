package participants

import (
	"encoding/json"
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

func (m *Manager) startConnection(token string, sendMessageInterval time.Duration) {
	var conn *websocket.Conn
	defer func() {
		if r := recover(); r != nil {
			log.Printf("connection %s: recovered from panic: %s", conn.LocalAddr(), r)
		}
	}()

	url := fmt.Sprintf("%s/connect", m.config.MessengerWsUrl)
	conn, _, err := websocket.DefaultDialer.Dial(url, nil)
	if err != nil {
		m.errChan <- fmt.Errorf("%s: could not connect to websocket: %s", url, err)
		return
	}

	authorizationPayload, err := json.Marshal(m.getWsAuthorizationDto(token))
	if err != nil {
		m.errChan <- fmt.Errorf("%s: error marshaling authorization message: %s", url, err)
		return
	}

	err = conn.WriteMessage(websocket.TextMessage, authorizationPayload)
	if err != nil {
		m.errChan <- fmt.Errorf("%s: error sending authorization message: %s", url, err)
		return
	}

	chatId, err := m.getChatId(conn, sendMessageInterval)
	if err != nil {
		m.errChan <- fmt.Errorf("%s: error getting chat id: %s", url, err)
		return
	}

	m.IncrementChatsCount()
	go m.startReadingMessages(conn)
	go m.startSendingMessages(conn, chatId, sendMessageInterval)
}

func (m *Manager) getWsGetChatsDto() wsGetChatsDto {
	return wsGetChatsDto{
		Type:    "get_chats",
		Payload: "",
	}
}

func (m *Manager) getChatId(conn *websocket.Conn, sendMessageInterval time.Duration) (string, error) {
	defer func() {
		if r := recover(); r != nil {
			log.Printf("connection %s: recovered from panic: %s", conn.LocalAddr(), r)
		}
	}()

	maxRetries := 10
	retry := 1

	for retry <= maxRetries {
		time.Sleep(sendMessageInterval)
		retry++

		err := conn.WriteJSON(m.getWsGetChatsDto())
		if err != nil {
			return "", fmt.Errorf("connection %s: error sending get chats message: %s", conn.LocalAddr(), err)
		}

		wsResponse := wsResponseDto{}
		err = conn.ReadJSON(&wsResponse)
		if err != nil {
			return "", fmt.Errorf("connection %s: error reading ws response: %s", conn.LocalAddr(), err)
		}

		if wsResponse.Type != "chats" {
			continue
		}

		var chatsPayload wsChatsResponsePayload
		err = json.Unmarshal(wsResponse.Payload, &chatsPayload)
		if err != nil {
			return "", fmt.Errorf("connection %s: error reading ws chats response: %s", conn.LocalAddr(), err)
		}

		if len(chatsPayload.Chats) == 0 {
			continue
		}

		return chatsPayload.Chats[0].Id, nil
	}

	return "", fmt.Errorf("connection %s: max retries in getting chat id exceeded: %d", conn.LocalAddr(), maxRetries)
}

func (m *Manager) getWsSendMessageDto(conn *websocket.Conn, chatId string, messageNumber int) wsSendMessageDto {
	return wsSendMessageDto{
		Type: "send_message",
		Payload: wsSendMessagePayload{
			ChatId:  chatId,
			Message: fmt.Sprintf("connection %s: message number %d", conn.LocalAddr(), messageNumber),
		},
	}
}

func (m *Manager) startSendingMessages(conn *websocket.Conn, chatId string, sendMessageInterval time.Duration) {
	defer func() {
		if r := recover(); r != nil {
			log.Printf("connection %s: recovered from panic: %s", conn.LocalAddr(), r)
		}
		conn.Close()
	}()

	messageNumber := 0
	for {
		messageNumber++
		select {
		case <-m.doneChan:
			return
		case <-time.After(sendMessageInterval):
			dto := m.getWsSendMessageDto(conn, chatId, messageNumber)
			if m.logWs {
				log.Println(dto.Payload.Message)
			}

			err := conn.WriteJSON(dto)
			if err != nil {
				m.errChan <- fmt.Errorf("connection %s: error sending message: %s", conn.LocalAddr(), err)
				return
			}
		}
	}
}

func (m *Manager) startReadingMessages(conn *websocket.Conn) {
	defer func() {
		if r := recover(); r != nil {
			log.Printf("connection %s: recovered from panic: %s", conn.LocalAddr(), r)
		}
	}()

	for {
		select {
		case <-m.doneChan:
			return
		default:
			_, bytes, err := conn.ReadMessage()
			if err != nil {
				m.errChan <- fmt.Errorf("connection %s: error receiving message: %s", conn.LocalAddr(), err)
				return
			}
			if m.logWs {
				log.Printf("connection %s: received message: %s", conn.LocalAddr(), bytes)
			}
		}
	}
}
