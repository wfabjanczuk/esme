package requests

import (
	"errors"
	"net/http"
	currentUser "participant-api/internal/modules/api/common/middlewares/current-user"
	"participant-api/internal/modules/infrastructure/users"
)

var (
	errEmptyUser     = errors.New("empty user from request")
	errMalformedUser = errors.New("malformed user from request")
)

func GetCurrentUser(r *http.Request) (*users.User, error) {
	userParam := r.Context().Value(currentUser.ParamsUserKey)
	if userParam == nil {
		return nil, errEmptyUser
	}
	user, valid := userParam.(*users.User)
	if !valid {
		return nil, errMalformedUser
	}
	return user, nil
}
