package api

import (
	"github.com/julienschmidt/httprouter"
	"log"
	"net/http"
	"participant-api/internal/config"
	"participant-api/internal/modules/api/common/middlewares"
	"participant-api/internal/modules/api/events"
	"participant-api/internal/modules/api/users"
	"participant-api/internal/modules/infrastructure"
)

type Module struct {
	Router http.Handler
}

func NewModule(cfg *config.Config, infrastructureModule *infrastructure.Module, logger *log.Logger) *Module {
	router := httprouter.New()
	middlewaresModule := middlewares.NewModule(cfg.JwtSecret, infrastructureModule.UsersRepository, logger)
	users.NewModule(cfg, infrastructureModule, middlewaresModule.CurrentUser, router, logger)
	events.NewModule(infrastructureModule, middlewaresModule.CurrentUser, router, logger)

	return &Module{
		Router: middlewaresModule.EnableCors.Handler(router),
	}
}
