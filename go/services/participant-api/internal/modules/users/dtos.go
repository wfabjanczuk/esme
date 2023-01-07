package users

import (
	"errors"
	"net/mail"
)

type SignUpDTO struct {
	Email           string `json:"email"`
	Password        string `json:"password"`
	ConfirmPassword string `json:"confirmPassword"`
	PhoneNumber     string `json:"phoneNumber"`
}

func (d *SignUpDTO) Validate() error {
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

type SignInDTO struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (d *SignInDTO) Validate() error {
	_, err := mail.ParseAddress(d.Email)
	if err != nil {
		return errors.New("invalid email address")
	}
	if len(d.Password) < 8 {
		return errors.New("password must be at least 8 characters")
	}
	return nil
}

type UpdateProfileDTO struct {
	PhoneNumber string `json:"phoneNumber"`
}

type ChangePasswordDTO struct {
	OldPassword        string `json:"oldPassword"`
	NewPassword        string `json:"newPassword"`
	ConfirmNewPassword string `json:"confirmNewPassword"`
}

func (d *ChangePasswordDTO) Validate() error {
	if len(d.OldPassword) < 8 {
		return errors.New("oldPassword must be at least 8 characters")
	}
	if len(d.NewPassword) < 8 {
		return errors.New("newPassword must be at least 8 characters")
	}
	if d.NewPassword != d.ConfirmNewPassword {
		return errors.New("confirmNewPassword must match newPassword")
	}
	return nil
}
