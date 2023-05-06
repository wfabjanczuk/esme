package layers

import (
	"messenger-api/internal/modules/infrastructure/chats"
	"messenger-api/internal/modules/infrastructure/messages"
	"messenger-api/internal/modules/ws/protocol"
)

type ChatCache struct {
	ChatId        string
	EventId       int32
	OrganizerId   int32
	ParticipantId int32
}

type ChatsManager interface {
	GetOrganizersManager() OrganizersManager
	GetParticipantsManager() ParticipantsManager

	SetChat(chatId string, organizerId, participantId, eventId int32)
	CloseChat(chatId string)
	GetChatCache(chatId string) (ChatCache, error)
	IsOrganizerInChat(organizerId int32, chatId string) bool
	IsParticipantInChat(organizerId int32, chatId string) bool
	SendUserMessageToChat(chatId string, message *messages.Message) error
	SendProtocolMessageToChat(chat *chats.Chat, protocolMessage *protocol.Message) error
}

type OrganizersManager interface {
	Send(id int32, outMsg *protocol.Message)
	SendInfo(id int32, info string)
	SendError(id int32, err error)
}

type ParticipantsManager interface {
	Send(id int32, outMsg *protocol.Message)
	SendInfo(id int32, info string)
	SendError(id int32, err error)
}
