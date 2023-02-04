package chat_requests

type ChatRequestDb struct {
	UserId  int `json:"userId"`
	EventId int `json:"eventId"`
}

type ChatRequestMq struct {
	ParticipantId int     `json:"participantId"`
	AgencyId      int     `json:"agencyId"`
	EventId       int     `json:"eventId"`
	Description   string  `json:"description"`
	Lat           float64 `json:"lat"`
	Lng           float64 `json:"lng"`
}
