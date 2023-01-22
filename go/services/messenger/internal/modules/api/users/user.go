package users

const (
	userTypeOrganizer   = 1
	userTypeParticipant = 2
)

type User struct {
	id       int32
	agencyId int32
	userType int32
	token    string
}

func (u *User) ID() int32 {
	return u.id
}

func (u *User) AgencyID() int32 {
	return u.agencyId
}

func (u *User) IsOrganizer() bool {
	return u.userType == userTypeOrganizer
}

func (u *User) IsParticipant() bool {
	return u.userType == userTypeParticipant
}

func (u *User) Token() string {
	return u.token
}
