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
)

type SendMessagePayload struct {
	ChatId  string `json:"chatId"`
	Message string `json:"message"`
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
