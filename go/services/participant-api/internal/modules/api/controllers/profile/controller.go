package profile

import (
	"encoding/json"
	"golang.org/x/crypto/bcrypt"
	"io"
	"log"
	"net/http"
	"participant-api/internal/modules/api/common/requests"
	"participant-api/internal/modules/api/common/responses"
	"participant-api/internal/modules/infrastructure/users"
)

type Controller struct {
	usersRepository *users.Repository
	responder       *responses.Responder
	logger          *log.Logger
}

func NewController(usersRepository *users.Repository, logger *log.Logger) *Controller {
	return &Controller{
		usersRepository: usersRepository,
		responder:       responses.NewResponder(logger),
		logger:          logger,
	}
}

func (c *Controller) GetProfile(w http.ResponseWriter, r *http.Request) {
	user, err := requests.GetCurrentUser(r)
	if err != nil {
		c.logger.Println(err)
		c.responder.WriteError(w, responses.ErrUnexpected, http.StatusInternalServerError)
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
		c.logger.Println(err)
		c.responder.WriteError(w, responses.ErrUnexpected, http.StatusInternalServerError)
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
		c.logger.Println(err)
		c.responder.WriteError(w, responses.ErrUnexpected, http.StatusInternalServerError)
		return
	}
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(changePasswordDTO.Password))
	if err != nil {
		c.responder.WriteError(w, responses.ErrInvalidPassword, http.StatusBadRequest)
		return
	}
	user.Password = changePasswordDTO.NewPassword

	err = c.usersRepository.ChangePassword(user)
	if err != nil {
		c.logger.Println(err)
		c.responder.WriteError(w, responses.ErrDatabase, http.StatusInternalServerError)
		return
	}

	c.responder.WriteJson(w, http.StatusOK, user)
}

func (c *Controller) DeleteProfile(w http.ResponseWriter, r *http.Request) {
	body, err := io.ReadAll(r.Body)
	if err != nil {
		c.responder.WriteError(w, err, http.StatusBadRequest)
		return
	}

	deleteProfileDTO := &deleteProfileDTO{}
	err = json.Unmarshal(body, deleteProfileDTO)
	if err != nil {
		c.responder.WriteError(w, err, http.StatusBadRequest)
		return
	}
	if err = deleteProfileDTO.validate(); err != nil {
		c.responder.WriteError(w, err, http.StatusBadRequest)
		return
	}

	user, err := requests.GetCurrentUser(r)
	if err != nil {
		c.logger.Println(err)
		c.responder.WriteError(w, responses.ErrUnexpected, http.StatusInternalServerError)
		return
	}
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(deleteProfileDTO.Password))
	if err != nil {
		c.responder.WriteError(w, responses.ErrInvalidPassword, http.StatusBadRequest)
		return
	}

	err = c.usersRepository.DeleteUser(user.Id)
	if err != nil {
		c.logger.Println(err)
		c.responder.WriteError(w, responses.ErrDatabase, http.StatusInternalServerError)
		return
	}

	c.responder.WriteJson(w, http.StatusOK, user)
}
