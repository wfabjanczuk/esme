package users

import "time"

type User struct {
	ID                int       `json:"id"`
	Email             string    `json:"email"`
	Password          string    `json:"-"`
	PhoneNumber       string    `json:"phoneNumber"`
	CreatedAt         time.Time `json:"createdAt"`
	UpdatedPasswordAt time.Time `json:"updatedPasswordAt"`
}
