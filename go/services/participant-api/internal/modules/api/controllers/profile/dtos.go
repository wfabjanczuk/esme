package profile

import (
	"participant-api/internal/modules/api/common/responses"
)

type updateProfileDTO struct {
	PhoneNumber string `json:"phoneNumber"`
}

type changePasswordDTO struct {
	Password           string `json:"password"`
	NewPassword        string `json:"newPassword"`
	ConfirmNewPassword string `json:"confirmNewPassword"`
}

func (d *changePasswordDTO) validate() error {
	if len(d.Password) < 8 {
		return responses.ErrPasswordTooShort
	}
	if len(d.NewPassword) < 8 {
		return responses.ErrNewPasswordTooShort
	}
	if d.NewPassword != d.ConfirmNewPassword {
		return responses.ErrConfirmNewPassword
	}
	if d.NewPassword == d.Password {
		return responses.ErrSamePasswords
	}
	return nil
}

type deleteProfileDTO struct {
	Password string `json:"password"`
}

func (d *deleteProfileDTO) validate() error {
	if len(d.Password) < 8 {
		return responses.ErrPasswordTooShort
	}
	return nil
}
