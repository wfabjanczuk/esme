package profile

import (
	"errors"
)

type updateProfileDTO struct {
	PhoneNumber string `json:"phoneNumber"`
}

type changePasswordDTO struct {
	OldPassword        string `json:"oldPassword"`
	NewPassword        string `json:"newPassword"`
	ConfirmNewPassword string `json:"confirmNewPassword"`
}

func (d *changePasswordDTO) validate() error {
	if len(d.OldPassword) < 8 {
		return errors.New("oldPassword must be at least 8 characters")
	}
	if len(d.NewPassword) < 8 {
		return errors.New("newPassword must be at least 8 characters")
	}
	if d.NewPassword != d.ConfirmNewPassword {
		return errors.New("confirmNewPassword must match newPassword")
	}
	if d.NewPassword == d.OldPassword {
		return errors.New("newPassword must be different from oldPassword")
	}
	return nil
}
