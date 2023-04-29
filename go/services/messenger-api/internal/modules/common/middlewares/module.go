package middlewares

import (
	"log"
	"messenger-api/internal/modules/authentication"
	"messenger-api/internal/modules/common/middlewares/current_organizer"
	"messenger-api/internal/modules/common/middlewares/enable_cors"
)

type Module struct {
	CurrentOrganizer *current_organizer.Middleware
	EnableCors       *enable_cors.Middleware
}

func NewModule(authenticator *authentication.Authenticator, logger *log.Logger) *Module {
	return &Module{
		CurrentOrganizer: current_organizer.NewMiddleware(authenticator, logger),
		EnableCors:       &enable_cors.Middleware{},
	}
}
