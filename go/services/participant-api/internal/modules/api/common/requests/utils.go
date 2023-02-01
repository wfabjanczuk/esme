package requests

import (
	"net/http"
	currentUser "participant-api/internal/modules/api/common/middlewares/current-user"
	"participant-api/internal/modules/infrastructure/users"
)

func GetCurrentUser(r *http.Request) (*users.User, error) {
	userParam := r.Context().Value(currentUser.ParamsUserKey)
	if userParam == nil {
		return nil, currentUser.EmptyUserError
	}
	user, valid := userParam.(*users.User)
	if !valid {
		return nil, currentUser.MalformedUserError
	}
	return user, nil
}
