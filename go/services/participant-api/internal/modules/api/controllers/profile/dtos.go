package profile

import (
	"participant-api/internal/modules/api/common/api_errors"
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
		return api_errors.ErrPasswordTooShort
	}
	if len(d.NewPassword) < 8 {
		return api_errors.ErrNewPasswordTooShort
	}
	if d.NewPassword != d.ConfirmNewPassword {
		return api_errors.ErrConfirmNewPassword
	}
	if d.NewPassword == d.Password {
		return api_errors.ErrSamePasswords
	}
	return nil
}

type deleteProfileDTO struct {
	Password string `json:"password"`
}

func (d *deleteProfileDTO) validate() error {
	if len(d.Password) < 8 {
		return api_errors.ErrPasswordTooShort
	}
	return nil
}
