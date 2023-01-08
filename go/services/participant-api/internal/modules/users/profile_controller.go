package users

import (
	"encoding/json"
	"errors"
	"golang.org/x/crypto/bcrypt"
	"io"
	"log"
	"net/http"
	"participant-api/internal/middlewares"
	"participant-api/internal/response"
)

var UnexpectedError = errors.New("unexpected error")
var InvalidOldPasswordError = errors.New("invalid oldPassword")

type profileController struct {
	usersRepository *usersRepository
	responder       *response.Responder
	logger          *log.Logger
}

func newProfileController(usersRepository *usersRepository, logger *log.Logger) *profileController {
	return &profileController{
		usersRepository: usersRepository,
		responder:       response.NewResponder(logger),
		logger:          logger,
	}
}

func GetUserFromRequest(r *http.Request) (*User, error) {
	userParam := r.Context().Value(middlewares.ParamsUserKey)
	if userParam == nil {
		return nil, UnexpectedError
	}
	user, valid := userParam.(*User)
	if !valid {
		return nil, UnexpectedError
	}
	return user, nil
}

func (c *profileController) getProfile(w http.ResponseWriter, r *http.Request) {
	user, err := GetUserFromRequest(r)
	if err != nil {
		c.responder.WriteError(w, UnexpectedError, http.StatusInternalServerError)
		return
	}
	c.responder.WriteJson(w, http.StatusOK, user)
}

func (c *profileController) updateProfile(w http.ResponseWriter, r *http.Request) {
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

	user, err := GetUserFromRequest(r)
	if err != nil {
		c.responder.WriteError(w, UnexpectedError, http.StatusInternalServerError)
		return
	}
	user.PhoneNumber = updateProfileDTO.PhoneNumber

	err = c.usersRepository.updateUser(user)
	if err != nil {
		c.responder.WriteError(w, err, http.StatusInternalServerError)
		return
	}

	c.responder.WriteJson(w, http.StatusOK, user)
}

func (c *profileController) changePassword(w http.ResponseWriter, r *http.Request) {
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

	user, err := GetUserFromRequest(r)
	if err != nil {
		c.responder.WriteError(w, UnexpectedError, http.StatusInternalServerError)
		return
	}
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(changePasswordDTO.OldPassword))
	if err != nil {
		c.responder.WriteError(w, InvalidOldPasswordError, http.StatusBadRequest)
		return
	}
	user.Password = changePasswordDTO.NewPassword

	err = c.usersRepository.changePassword(user)
	if err != nil {
		c.responder.WriteError(w, err, http.StatusInternalServerError)
		return
	}

	c.responder.WriteJson(w, http.StatusOK, user)
}
