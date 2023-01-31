package auth

import (
	"errors"
	"net/mail"
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
		return errors.New("invalid email address")
	}
	if len(d.Password) < 8 {
		return errors.New("password must be at least 8 characters")
	}
	if d.Password != d.ConfirmPassword {
		return errors.New("confirmPassword must match password")
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
		return errors.New("invalid email address")
	}
	if len(d.Password) < 8 {
		return errors.New("password must be at least 8 characters")
	}
	return nil
}
