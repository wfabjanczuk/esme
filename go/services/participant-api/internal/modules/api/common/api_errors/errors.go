package api_errors

import (
	"errors"
	"fmt"
)

var (
	ErrUnexpected = errors.New("unexpected error")
	ErrDatabase   = errors.New("database error")
	ErrApi        = errors.New("api error")

	ErrInvalidHeader      = errors.New("invalid authorization header")
	ErrInvalidToken       = errors.New("invalid token")
	ErrInvalidApiKey      = errors.New("invalid api key")
	ErrInvalidEmail       = errors.New("invalid email address")
	ErrInvalidPassword    = errors.New("invalid password")
	ErrInvalidCredentials = errors.New("invalid email or password")
	ErrInvalidRouteId     = errors.New("invalid `id` route parameter")
	ErrInvalidRequestBody = errors.New("invalid request body")

	ErrPasswordTooShort    = errors.New("password must be at least 8 characters")
	ErrOldPasswordTooShort = errors.New("oldPassword must be at least 8 characters")
	ErrNewPasswordTooShort = errors.New("newPassword must be at least 8 characters")
	ErrConfirmPassword     = errors.New("confirmPassword must match password")
	ErrConfirmNewPassword  = errors.New("confirmNewPassword must match newPassword")
	ErrSamePasswords       = errors.New("newPassword must be different from oldPassword")

	ErrEmailExists         = errors.New("email already exists")
	ErrChatRequestExists   = errors.New("chat request already exists")
	ErrDescriptionTooLong  = errors.New("description must be at most 2000 characters")
	ErrApiResourceNotFound = errors.New("api resource not found")
)

func NewErrInvalidTimeFilter(field string) error {
	return errors.New(fmt.Sprintf("invalid format of `%s` filter value; RFC3339 required", field))
}

func NewErrEventNotFound(id int) error {
	return errors.New(fmt.Sprintf("event with id %d not found", id))
}
