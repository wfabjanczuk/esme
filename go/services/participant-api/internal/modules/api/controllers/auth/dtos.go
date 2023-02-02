package auth

import (
	"net/mail"
	"participant-api/internal/modules/api/common/responses"
)

type signUpDTO struct {
	Email           string `json:"email"`
	Password        string `json:"password"`
	ConfirmPassword string `json:"confirmPassword"`
	PhoneNumber     string `json:"phoneNumber"`
}

func (d *signUpDTO) validate() error {
	_, err := mail.ParseAddress(d.Email)
	if err != nil {
		return responses.ErrInvalidEmail
	}
	if len(d.Password) < 8 {
		return responses.ErrPasswordTooShort
	}
	if d.Password != d.ConfirmPassword {
		return responses.ErrConfirmPassword
	}
	return nil
}

type signInDTO struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (d *signInDTO) validate() error {
	_, err := mail.ParseAddress(d.Email)
	if err != nil {
		return responses.ErrInvalidEmail
	}
	if len(d.Password) < 8 {
		return responses.ErrPasswordTooShort
	}
	return nil
}
