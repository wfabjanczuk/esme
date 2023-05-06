package connections

import (
	"messenger-api/internal/modules/ws/protocol"
	"time"
)

type OrganizerMessage struct {
	Source       *OrganizerConnection
	Message      *protocol.Message
	TimeReceived time.Time
}

func NewOrganizerMessage(
	message *protocol.Message, sourceConnection *OrganizerConnection,
) *OrganizerMessage {
	return &OrganizerMessage{
		Source:       sourceConnection,
		Message:      message,
		TimeReceived: time.Now(),
	}
}
