package middlewares

import (
	"log"
	"participant-api/internal/modules/api/common/middlewares/current_user"
	"participant-api/internal/modules/api/common/middlewares/enable_cors"
	"participant-api/internal/modules/infrastructure/users"
)

type Module struct {
	CurrentUser *current_user.Middleware
	EnableCors  *enable_cors.Middleware
}

func NewModule(jwtSecret string, usersRepository *users.Repository, logger *log.Logger) *Module {
	return &Module{
		CurrentUser: current_user.NewMiddleware(jwtSecret, usersRepository, logger),
		EnableCors:  &enable_cors.Middleware{},
	}
}
