package api

import (
	"github.com/julienschmidt/httprouter"
	"log"
	"messenger-api/internal/config"
	"messenger-api/internal/modules/api/input"
	"messenger-api/internal/modules/api/output"
	"messenger-api/internal/modules/infrastructure"
	"net/http"
)

type Module struct {
	Router http.Handler
}

func NewModule(cfg *config.Config, infrastructureModule *infrastructure.Module, logger *log.Logger) *Module {
	outputManager := output.NewManager(infrastructureModule.MessagesRepository)
	inputManager := input.NewManager(cfg, infrastructureModule.ChatsRepository, outputManager, logger)

	router := httprouter.New()
	router.HandlerFunc(http.MethodGet, "/ws", inputManager.UpgradeConnection)

	return &Module{
		Router: router,
	}
}
