package users

import (
	"github.com/julienschmidt/httprouter"
	"log"
	"net/http"
	"participant-api/internal/database"
)

type UsersModule struct {
	AuthController *AuthController
}

func NewUsersModule(logger *log.Logger, participantDSN string, router *httprouter.Router) *UsersModule {
	m := &UsersModule{
		AuthController: NewAuthController(
			logger,
			database.SetupConnection(participantDSN, logger),
		),
	}

	router.HandlerFunc(http.MethodPost, "/auth/sign-up", m.AuthController.SignUp)
	return m
}
