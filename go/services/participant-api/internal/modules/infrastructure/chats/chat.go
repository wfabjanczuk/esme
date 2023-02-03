package chats

type ChatSetup struct {
	ParticipantId int     `json:"participantId"`
	AgencyId      int     `json:"agencyId"`
	EventId       int     `json:"eventId"`
	Description   string  `json:"description"`
	Lat           float64 `json:"lat"`
	Lng           float64 `json:"lng"`
}

type ChatRequest struct {
	UserId  int `json:"userId"`
	EventId int `json:"eventId"`
}
