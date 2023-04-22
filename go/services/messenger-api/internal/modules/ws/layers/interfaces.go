package layers

import (
	"github.com/gorilla/websocket"
	"messenger-api/internal/modules/authentication"
	"messenger-api/internal/modules/infrastructure/chats"
	"messenger-api/internal/modules/infrastructure/messages"
	"messenger-api/internal/modules/ws/connections"
	"messenger-api/internal/modules/ws/protocol"
)

type OrganizerConsumer interface {
	ConsumeMessage(msg *connections.OrganizerMessage)
}

type ParticipantConsumer interface {
	ConsumeMessage(msg *connections.ParticipantMessage)
}

type OrganizersManager interface {
	SetConsumer(organizerConsumer OrganizerConsumer)
	AddConnection(organizer *authentication.Organizer, wsConnection *websocket.Conn) error
	Send(id int32, outMsg *protocol.Message)
	SendInfo(id int32, info string)
	SendError(id int32, err error)
}

type ParticipantsManager interface {
	SetConsumer(participantConsumer ParticipantConsumer)
	AddConnection(participant *authentication.Participant, wsConnection *websocket.Conn) error
	Send(id int32, outMsg *protocol.Message)
	SendInfo(id int32, info string)
	SendError(id int32, err error)
}

type ChatsManager interface {
	SetChat(chatId string, organizerId, participantId int32)
	IsOrganizerInChat(organizerId int32, chatId string) bool
	IsParticipantInChat(organizerId int32, chatId string) bool
	SendUserMessageToChat(chatId string, message *messages.Message) error
	SendProtocolMessageToChat(chat *chats.Chat, protocolMessage *protocol.Message) error
}
