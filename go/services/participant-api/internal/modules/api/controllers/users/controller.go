package users

import (
	"database/sql"
	"github.com/julienschmidt/httprouter"
	"log"
	"net/http"
	"participant-api/internal/modules/api/common/api_errors"
	"participant-api/internal/modules/api/common/responses"
	"participant-api/internal/modules/infrastructure/users"
	"strconv"
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

func (c *Controller) GetUser(w http.ResponseWriter, r *http.Request) {
	idString := httprouter.ParamsFromContext(r.Context()).ByName("id")
	id, err := strconv.Atoi(idString)
	if err != nil {
		c.logger.Println(err)
		c.responder.WriteError(w, api_errors.ErrInvalidRouteId, http.StatusBadRequest)
		return
	}

	user, err := c.usersRepository.GetUserById(id)
	if err == sql.ErrNoRows {
		c.responder.WriteError(w, api_errors.NewErrUserNotFound(id), http.StatusNotFound)
		return
	}
	if err != nil {
		c.logger.Println(err)
		c.responder.WriteError(w, api_errors.ErrDatabase, http.StatusInternalServerError)
		return
	}

	c.responder.WriteJson(w, http.StatusOK, user)
}
