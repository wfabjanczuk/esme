package interfaces

import (
	"messenger-api/internal/modules/infrastructure/chats"
	"messenger-api/internal/modules/infrastructure/messages"
	"messenger-api/internal/modules/ws/protocol"
)

type ChatsManager interface {
	SetChat(chatId string, organizerId, participantId int32)
	IsOrganizerInChat(organizerId int32, chatId string) bool
	IsParticipantInChat(organizerId int32, chatId string) bool
	SendUserMessageToChat(chatId string, message *messages.Message) error
	SendProtocolMessageToChat(chat *chats.Chat, protocolMessage *protocol.Message) error
}
