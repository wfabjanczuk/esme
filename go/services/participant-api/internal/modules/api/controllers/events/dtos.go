package events

import "participant-api/internal/modules/infrastructure/events"

type getEventResponseDto struct {
	events.Event
	IsChatRequested bool `json:"isChatRequested"`
}
