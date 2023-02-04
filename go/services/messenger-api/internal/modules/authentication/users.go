package authentication

type Organizer struct {
	Id          int32  `json:"id"`
	AgencyId    int32  `json:"agencyId"`
	Role        int32  `json:"role"`
	DisplayName string `json:"displayName"`
}

type Participant struct {
	Id          int32  `json:"id"`
	Email       string `json:"email"`
	PhoneNumber string `json:"phoneNumber"`
}
