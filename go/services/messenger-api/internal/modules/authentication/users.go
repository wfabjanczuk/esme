package authentication

var OrganizerAgencyRoles = map[int32]struct{}{
	2: {},
	3: {},
	4: {},
}

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
