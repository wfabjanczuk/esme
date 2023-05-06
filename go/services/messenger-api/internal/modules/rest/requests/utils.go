package requests

import (
	"errors"
	"messenger-api/internal/modules/authentication"
	"messenger-api/internal/modules/common/middlewares/current_organizer"
	"messenger-api/internal/modules/common/middlewares/current_participant"
	"net/http"
)

var (
	errEmptyUser     = errors.New("empty user from request")
	errMalformedUser = errors.New("malformed user from request")
)

func GetCurrentOrganizer(r *http.Request) (*authentication.Organizer, error) {
	userParam := r.Context().Value(current_organizer.ParamsOrganizerKey)
	if userParam == nil {
		return nil, errEmptyUser
	}
	user, valid := userParam.(*authentication.Organizer)
	if !valid {
		return nil, errMalformedUser
	}
	return user, nil
}

func GetCurrentParticipant(r *http.Request) (*authentication.Participant, error) {
	userParam := r.Context().Value(current_participant.ParamsParticipantKey)
	if userParam == nil {
		return nil, errEmptyUser
	}
	user, valid := userParam.(*authentication.Participant)
	if !valid {
		return nil, errMalformedUser
	}
	return user, nil
}
