package out

import (
	"messenger-api/internal/modules/infrastructure/chats"
	"messenger-api/internal/modules/infrastructure/messages"
)

const (
	Error         = "error"
	NewChat       = "new_chat"
	Chats         = "chats"
	ChatHistory   = "chat_history"
	SystemMessage = "system_message"
	UserMessage   = "user_message"
)

type NewChatPayload struct {
	*chats.Chat
}

type ChatsPayload struct {
	Chats []*chats.Chat `json:"chats"`
}

type ChatHistoryPayload struct {
	ChatId   string              `json:"chatId"`
	Messages []*messages.Message `json:"messages"`
}

type UserMessagePayload struct {
	*messages.Message
}
