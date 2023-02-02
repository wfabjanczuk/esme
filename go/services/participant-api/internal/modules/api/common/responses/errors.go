package responses

import (
	"errors"
	"fmt"
)

var (
	ErrUnexpected = errors.New("unexpected error")
	ErrDatabase   = errors.New("database error")

	ErrInvalidHeader      = errors.New("invalid authorization header")
	ErrInvalidToken       = errors.New("invalid token")
	ErrInvalidEmail       = errors.New("invalid email address")
	ErrInvalidPassword    = errors.New("invalid password")
	ErrInvalidCredentials = errors.New("invalid email or password")

	ErrPasswordTooShort    = errors.New("password must be at least 8 characters")
	ErrNewPasswordTooShort = errors.New("newPassword must be at least 8 characters")
	ErrConfirmPassword     = errors.New("confirmPassword must match password")
	ErrConfirmNewPassword  = errors.New("confirmNewPassword must match newPassword")
	ErrSamePasswords       = errors.New("newPassword must be different from current password")

	ErrEmailExists    = errors.New("email already exists")
	ErrInvalidQueryId = errors.New("invalid `id` query parameter")
)

func NewErrInvalidTimeFilter(field string) error {
	return errors.New(fmt.Sprintf("invalid format of `%s` filter value; RFC3339 required", field))
}

func NewErrEventNotFound(id int) error {
	return errors.New(fmt.Sprintf("event with id %d not found", id))
}
