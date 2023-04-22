package connections

import (
	"messenger-api/internal/modules/ws/protocol"
	"time"
)

type ParticipantMessage struct {
	Message      *protocol.Message
	Source       *ParticipantConnection
	TimeReceived time.Time
}

func NewParticipantMessage(
	message *protocol.Message, sourceConnection *ParticipantConnection,
) *ParticipantMessage {
	return &ParticipantMessage{
		Message:      message,
		Source:       sourceConnection,
		TimeReceived: time.Now(),
	}
}
