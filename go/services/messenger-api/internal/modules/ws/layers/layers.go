package layers

import (
	"messenger-api/internal/modules/infrastructure/messages"
	"messenger-api/internal/modules/ws/protocol"
)

type ChatCache struct {
	EventId       int32
	OrganizerId   int32
	ParticipantId int32
}

type ChatsManager interface {
	SetChatCache(chatId string, organizerId, participantId, eventId int32)
	RemoveChatCache(chatId string)
	GetChatCache(chatId string) (ChatCache, error)
	IsOrganizerInChat(organizerId int32, chatId string) bool
	IsParticipantInChat(organizerId int32, chatId string) bool
	SendUserMessageToChat(chatId string, message *messages.Message) error
	SendProtocolMessageToChat(chatId string, protocolMessage *protocol.Message) error
}

type OrganizersManager interface {
	IsConnected(id int32) bool
	Send(id int32, outMsg *protocol.Message)
	SendInfo(id int32, info string)
	SendError(id int32, err error)
}

type ParticipantsManager interface {
	IsConnected(id int32) bool
	Send(id int32, outMsg *protocol.Message)
	SendInfo(id int32, info string)
	SendError(id int32, err error)
}
