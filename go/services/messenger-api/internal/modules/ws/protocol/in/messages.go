package in

import (
	"encoding/json"
	"messenger-api/internal/modules/ws/protocol"
)

const (
	MsgTypeStartChat      = "start_chat"
	MsgTypeGetChats       = "get_chats"
	MsgTypeSendMessage    = "send_message"
	MsgTypeGetChatHistory = "get_chat_history"
	MsgTypeCloseChat      = "close_chat"
)

type SendMessagePayload struct {
	ChatId  string   `json:"chatId"`
	Message string   `json:"message"`
	Lat     *float64 `json:"lat,omitempty"`
	Lng     *float64 `json:"lng,omitempty"`
}

func ParseSendMessagePayload(msg *protocol.Message) (*SendMessagePayload, error) {
	inPayload := &SendMessagePayload{}
	return inPayload, json.Unmarshal(msg.Payload, inPayload)
}

type GetChatHistoryPayload struct {
	ChatId string `json:"chatId"`
}

func ParseGetChatHistoryPayload(msg *protocol.Message) (*GetChatHistoryPayload, error) {
	inPayload := &GetChatHistoryPayload{}
	return inPayload, json.Unmarshal(msg.Payload, inPayload)
}

type CloseChatPayload struct {
	ChatId string `json:"chatId"`
}

func ParseCloseChatPayload(msg *protocol.Message) (*CloseChatPayload, error) {
	inPayload := &CloseChatPayload{}
	return inPayload, json.Unmarshal(msg.Payload, inPayload)
}
