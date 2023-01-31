package users

import "time"

type User struct {
	Id          int       `json:"id"`
	Email       string    `json:"email"`
	Password    string    `json:"-"`
	PhoneNumber string    `json:"phoneNumber"`
	TimeCreated time.Time `json:"timeCreated"`
	TimeSignOut time.Time `json:"timeSignOut"`
}
