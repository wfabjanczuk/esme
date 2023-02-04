package in

const (
	StartChat      = "start_chat"
	GetChats       = "get_chats"
	SendMessage    = "send_message"
	GetChatHistory = "get_chat_history"
)

type SendMessagePayload struct {
	ChatId  string `json:"chatId"`
	Message string `json:"message"`
}

type GetChatHistoryPayload struct {
	ChatId string `json:"chatId"`
}
