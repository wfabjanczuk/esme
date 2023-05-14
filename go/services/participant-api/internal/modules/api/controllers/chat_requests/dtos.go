package chat_requests

import (
	"participant-api/internal/modules/api/common/api_errors"
)

type doesChatRequestLockExistDto struct {
	EventId int `json:"eventId"`
}

type doesChatRequestLockExistResponseDto struct {
	Result bool `json:"result"`
}

type createChatRequestDto struct {
	EventId     int      `json:"eventId"`
	Description string   `json:"description"`
	Lat         *float64 `json:"lat,omitempty"`
	Lng         *float64 `json:"lng,omitempty"`
}

func (d *createChatRequestDto) validate() error {
	if len(d.Description) > 2000 {
		return api_errors.ErrDescriptionTooLong
	}
	return nil
}

type deleteChatRequestLockDto struct {
	ParticipantId int `json:"participantId"`
	EventId       int `json:"eventId"`
}
