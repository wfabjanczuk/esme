package chats

import (
	"participant-api/internal/modules/api/common/api_errors"
)

type doesChatRequestExistDto struct {
	EventId int `json:"eventId"`
}

type doesChatRequestExistResponse struct {
	Result bool `json:"result"`
}

type requestChatDto struct {
	EventId     int     `json:"eventId"`
	Description string  `json:"description"`
	Lat         float64 `json:"lat"`
	Lng         float64 `json:"lng"`
}

func (d *requestChatDto) validate() error {
	if len(d.Description) > 2000 {
		return api_errors.ErrDescriptionTooLong
	}
	return nil
}
