package chat_requests

import (
	"participant-api/internal/modules/api/common/api_errors"
)

type doesChatRequestExistDto struct {
	EventId int `json:"eventId"`
}

type doesChatRequestExistResponse struct {
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

type deleteChatRequestDto struct {
	ParticipantId int `json:"participantId"`
	EventId       int `json:"eventId"`
}
