package requests

type addChatRequestDTO struct {
	AgencyID      int `json:"agencyId"`
	EventID       int `json:"eventId"`
	ParticipantID int `json:"participantId"`
}
