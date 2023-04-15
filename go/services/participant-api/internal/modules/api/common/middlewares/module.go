package middlewares

import (
	"log"
	"participant-api/internal/modules/api/common/middlewares/api_key"
	"participant-api/internal/modules/api/common/middlewares/current_user"
	"participant-api/internal/modules/api/common/middlewares/enable_cors"
	"participant-api/internal/modules/infrastructure/users"
)

type Module struct {
	CurrentUser *current_user.Middleware
	ApiKey      *api_key.Middleware
	EnableCors  *enable_cors.Middleware
}

func NewModule(jwtSecret, participantApiKey string, usersRepository *users.Repository, logger *log.Logger) *Module {
	return &Module{
		CurrentUser: current_user.NewMiddleware(jwtSecret, usersRepository, logger),
		ApiKey:      api_key.NewMiddleware(participantApiKey, logger),
		EnableCors:  &enable_cors.Middleware{},
	}
}
