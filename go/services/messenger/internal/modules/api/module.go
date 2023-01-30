package api

import (
	"github.com/julienschmidt/httprouter"
	"log"
	"messenger/internal/config"
	"messenger/internal/modules/api/input"
	"messenger/internal/modules/api/output"
	"messenger/internal/modules/infrastructure"
	"net/http"
)

type Module struct {
	inputManager  *input.Manager
	outputManager *output.Manager
}

func NewModule(cfg *config.Config, logger *log.Logger, infrastructureModule *infrastructure.Module, router *httprouter.Router) *Module {
	outputManager := output.NewManager(infrastructureModule.MessagesRepository)
	inputManager := input.NewManager(cfg, infrastructureModule.ChatsRepository, outputManager, logger)
	router.HandlerFunc(http.MethodGet, "/ws", inputManager.UpgradeConnection)

	return &Module{
		inputManager:  inputManager,
		outputManager: outputManager,
	}
}
