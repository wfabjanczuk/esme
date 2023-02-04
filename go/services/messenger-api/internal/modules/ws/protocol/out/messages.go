package out

import (
	"messenger-api/internal/modules/infrastructure/chats"
	"messenger-api/internal/modules/infrastructure/messages"
)

const (
	MsgTypeError         = "error"
	MsgTypeNewChat       = "new_chat"
	MsgTypeChats         = "chats"
	MsgTypeChatHistory   = "chat_history"
	MsgTypeSystemMessage = "system_message"
	MsgTypeUserMessage   = "user_message"
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
