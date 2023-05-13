package chat_requests

type ChatRequest struct {
	ParticipantId int      `json:"participantId"`
	AgencyId      int      `json:"agencyId"`
	EventId       int      `json:"eventId"`
	Description   string   `json:"description"`
	Lat           *float64 `json:"lat,omitempty"`
	Lng           *float64 `json:"lng,omitempty"`
}

type ChatRequestLock struct {
	UserId  int `json:"userId"`
	EventId int `json:"eventId"`
}
