package in

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

type GetChatHistoryPayload struct {
	ChatId string `json:"chatId"`
}
