package profile

import (
	"encoding/json"
	"errors"
	"golang.org/x/crypto/bcrypt"
	"io"
	"log"
	"net/http"
	"participant-api/internal/modules/api/requests"
	"participant-api/internal/modules/api/responses"
	"participant-api/internal/modules/infrastructure/users"
)

var invalidOldPasswordError = errors.New("invalid oldPassword")
var unexpectedError = errors.New("unexpected error")

type Controller struct {
	usersRepository *users.Repository
	responder       *responses.Responder
}

func NewController(usersRepository *users.Repository, logger *log.Logger) *Controller {
	return &Controller{
		usersRepository: usersRepository,
		responder:       responses.NewResponder(logger),
	}
}

func (c *Controller) GetProfile(w http.ResponseWriter, r *http.Request) {
	user, err := requests.GetCurrentUser(r)
	if err != nil {
		c.responder.WriteError(w, unexpectedError, http.StatusInternalServerError)
		return
	}
	c.responder.WriteJson(w, http.StatusOK, user)
}

func (c *Controller) UpdateProfile(w http.ResponseWriter, r *http.Request) {
	body, err := io.ReadAll(r.Body)
	if err != nil {
		c.responder.WriteError(w, err, http.StatusBadRequest)
		return
	}

	updateProfileDTO := &updateProfileDTO{}
	err = json.Unmarshal(body, updateProfileDTO)
	if err != nil {
		c.responder.WriteError(w, err, http.StatusBadRequest)
		return
	}

	user, err := requests.GetCurrentUser(r)
	if err != nil {
		c.responder.WriteError(w, unexpectedError, http.StatusInternalServerError)
		return
	}
	user.PhoneNumber = updateProfileDTO.PhoneNumber

	err = c.usersRepository.UpdateUser(user)
	if err != nil {
		c.responder.WriteError(w, err, http.StatusInternalServerError)
		return
	}

	c.responder.WriteJson(w, http.StatusOK, user)
}

func (c *Controller) ChangePassword(w http.ResponseWriter, r *http.Request) {
	body, err := io.ReadAll(r.Body)
	if err != nil {
		c.responder.WriteError(w, err, http.StatusBadRequest)
		return
	}

	changePasswordDTO := &changePasswordDTO{}
	err = json.Unmarshal(body, changePasswordDTO)
	if err != nil {
		c.responder.WriteError(w, err, http.StatusBadRequest)
		return
	}
	if err = changePasswordDTO.validate(); err != nil {
		c.responder.WriteError(w, err, http.StatusBadRequest)
		return
	}

	user, err := requests.GetCurrentUser(r)
	if err != nil {
		c.responder.WriteError(w, unexpectedError, http.StatusInternalServerError)
		return
	}
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(changePasswordDTO.OldPassword))
	if err != nil {
		c.responder.WriteError(w, invalidOldPasswordError, http.StatusBadRequest)
		return
	}
	user.Password = changePasswordDTO.NewPassword

	err = c.usersRepository.ChangePassword(user)
	if err != nil {
		c.responder.WriteError(w, err, http.StatusInternalServerError)
		return
	}

	c.responder.WriteJson(w, http.StatusOK, user)
}
