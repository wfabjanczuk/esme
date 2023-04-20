package out

import (
	"encoding/json"
	"messenger-api/internal/modules/infrastructure/chats"
	"messenger-api/internal/modules/infrastructure/messages"
	"messenger-api/internal/modules/ws/layers/consumers/protocol"
)

const (
	MsgTypeInfo        = "info"
	MsgTypeError       = "error"
	MsgTypeNewChat     = "new_chat"
	MsgTypeChats       = "chats"
	MsgTypeChatHistory = "chat_history"
	MsgTypeUserMessage = "user_message"
)

type infoPayload struct {
	Message string `json:"message"`
}

func BuildInfo(info string) (*protocol.Message, error) {
	outPayloadBytes, err := json.Marshal(infoPayload{Message: info})
	if err != nil {
		return nil, err
	}

	return &protocol.Message{
		Type:    MsgTypeInfo,
		Payload: outPayloadBytes,
	}, nil
}

type errorPayload struct {
	Message string `json:"message"`
}

func BuildError(error error) (*protocol.Message, error) {
	outPayloadBytes, err := json.Marshal(errorPayload{Message: error.Error()})
	if err != nil {
		return nil, err
	}

	return &protocol.Message{
		Type:    MsgTypeError,
		Payload: outPayloadBytes,
	}, nil
}

type newChatPayload struct {
	*chats.Chat
}

func BuildNewChat(chat *chats.Chat) (*protocol.Message, error) {
	outPayloadBytes, err := json.Marshal(newChatPayload{Chat: chat})
	if err != nil {
		return nil, err
	}

	return &protocol.Message{
		Type:    MsgTypeNewChat,
		Payload: outPayloadBytes,
	}, nil
}

type chatsPayload struct {
	Chats []*chats.Chat `json:"chats"`
}

func BuildChats(chats []*chats.Chat) (*protocol.Message, error) {
	outPayloadBytes, err := json.Marshal(chatsPayload{Chats: chats})
	if err != nil {
		return nil, err
	}

	return &protocol.Message{
		Type:    MsgTypeChats,
		Payload: outPayloadBytes,
	}, nil
}

type chatHistoryPayload struct {
	ChatId   string              `json:"chatId"`
	Messages []*messages.Message `json:"messages"`
}

func BuildChatHistory(chatId string, chatMessages []*messages.Message) (*protocol.Message, error) {
	outPayloadBytes, err := json.Marshal(chatHistoryPayload{ChatId: chatId, Messages: chatMessages})
	if err != nil {
		return nil, err
	}

	return &protocol.Message{
		Type:    MsgTypeChatHistory,
		Payload: outPayloadBytes,
	}, nil
}

type userMessagePayload struct {
	*messages.Message
}

func BuildUserMessage(message *messages.Message) (*protocol.Message, error) {
	outPayloadBytes, err := json.Marshal(userMessagePayload{Message: message})
	if err != nil {
		return nil, err
	}

	return &protocol.Message{
		Type:    MsgTypeUserMessage,
		Payload: outPayloadBytes,
	}, nil
}
