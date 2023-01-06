package users

import (
	"database/sql"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"participant-api/internal/response"
)

type AuthController struct {
	usersRepository *UsersRepository
	responder       *response.Responder
	logger          *log.Logger
}

func NewAuthController(logger *log.Logger, db *sql.DB) *AuthController {
	return &AuthController{
		usersRepository: NewUsersRepository(logger, db),
		responder:       response.NewResponder(logger),
		logger:          logger,
	}
}

func (c *AuthController) SignUp(w http.ResponseWriter, r *http.Request) {
	body, err := io.ReadAll(r.Body)
	if err != nil {
		c.responder.WriteError(w, err, http.StatusBadRequest)
		return
	}

	var createUserDTO SignUpDTO
	err = json.Unmarshal(body, &createUserDTO)
	if err != nil {
		c.responder.WriteError(w, err, http.StatusBadRequest)
		return
	}

	user, err := c.usersRepository.InsertUser(createUserDTO)
	if err != nil {
		c.responder.WriteError(w, err, http.StatusBadRequest)
		return
	}

	c.responder.WriteJson(w, http.StatusOK, user)
}
