package middlewares

import (
	"log"
	currentUser "participant-api/internal/modules/api/common/middlewares/current-user"
	enableCors "participant-api/internal/modules/api/common/middlewares/enable-cors"
	"participant-api/internal/modules/infrastructure/users"
)

type Module struct {
	CurrentUser *currentUser.Middleware
	EnableCors  *enableCors.Middleware
}

func NewModule(jwtSecret string, usersRepository *users.Repository, logger *log.Logger) *Module {
	return &Module{
		CurrentUser: currentUser.NewMiddleware(jwtSecret, usersRepository, logger),
		EnableCors:  &enableCors.Middleware{},
	}
}
