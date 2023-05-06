package chat_requests

type ChatRequest struct {
	ParticipantId int32    `json:"participantId"`
	AgencyId      int32    `json:"agencyId"`
	EventId       int32    `json:"eventId"`
	Description   string   `json:"description"`
	Lat           *float64 `json:"lat,omitempty"`
	Lng           *float64 `json:"lng,omitempty"`
}
