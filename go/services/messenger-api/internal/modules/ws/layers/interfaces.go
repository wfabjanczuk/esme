package layers

import (
	"github.com/gorilla/websocket"
	"messenger-api/internal/modules/authentication"
	"messenger-api/internal/modules/infrastructure/chats"
	"messenger-api/internal/modules/infrastructure/messages"
	"messenger-api/internal/modules/ws/protocol"
)

type UsersManager interface {
	SetOrganizerConsumer(organizerConsumer OrganizerConsumer)
	AddOrganizerConnection(organizer *authentication.Organizer, wsConnection *websocket.Conn) error
	SendToOrganizer(id int32, outMsg *protocol.Message)
	SendInfoToOrganizer(id int32, info string)
	SendErrorToOrganizer(id int32, err error)

	SetParticipantConsumer(participantConsumer ParticipantConsumer)
	AddParticipantConnection(participant *authentication.Participant, wsConnection *websocket.Conn) error
	SendToParticipant(id int32, outMsg *protocol.Message)
	SendInfoToParticipant(id int32, info string)
	SendErrorToParticipant(id int32, err error)
}

type ChatsManager interface {
	SetChat(chatId string, organizerId, participantId int32)
	IsOrganizerInChat(organizerId int32, chatId string) bool
	IsParticipantInChat(organizerId int32, chatId string) bool
	SendUserMessageToChat(chatId string, message *messages.Message) error
	SendProtocolMessageToChat(chat *chats.Chat, protocolMessage *protocol.Message) error
}

type OrganizerConsumer interface {
	ConsumeMessage(organizer *authentication.Organizer, msg *protocol.Message)
}

type ParticipantConsumer interface {
	ConsumeMessage(participant *authentication.Participant, msg *protocol.Message)
}
