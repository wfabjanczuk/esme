package users

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"participant-api/internal/modules/api/common/api_errors"
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

func (c *Controller) GetUsersByIds(w http.ResponseWriter, r *http.Request) {
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		c.logger.Println(err)
		c.responder.WriteError(w, api_errors.ErrInvalidRequestBody, http.StatusBadRequest)
		return
	}

	payload := &getUsersByIdsDto{}
	err = json.Unmarshal(body, payload)
	if err != nil {
		c.logger.Println(err)
		c.responder.WriteError(w, api_errors.ErrInvalidRequestBody, http.StatusBadRequest)
		return
	}
	if len(payload.Ids) == 0 {
		c.responder.WriteError(w, api_errors.ErrInvalidRequestBody, http.StatusBadRequest)
		return
	}

	usersMap, err := c.usersRepository.GetUsers(payload.Ids)
	if err != nil {
		c.logger.Println(err)
		c.responder.WriteError(w, api_errors.ErrDatabase, http.StatusInternalServerError)
		return
	}

	c.responder.WriteJson(w, http.StatusOK, usersMap)
}
