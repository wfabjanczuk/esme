package auth

import (
	"net/mail"
	"participant-api/internal/modules/api/common/api_errors"
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
		return api_errors.ErrInvalidEmail
	}
	if len(d.Password) < 8 {
		return api_errors.ErrPasswordTooShort
	}
	if d.Password != d.ConfirmPassword {
		return api_errors.ErrConfirmPassword
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
		return api_errors.ErrInvalidEmail
	}
	if len(d.Password) < 8 {
		return api_errors.ErrPasswordTooShort
	}
	return nil
}
