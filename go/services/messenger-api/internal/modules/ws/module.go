package ws

import (
	"github.com/julienschmidt/httprouter"
	"log"
	"messenger-api/internal/config"
	"messenger-api/internal/modules/infrastructure"
	"messenger-api/internal/modules/ws/managers/chats"
	"net/http"
)

type Module struct {
	Router http.Handler
}

func NewModule(cfg *config.Config, infra *infrastructure.Module, logger *log.Logger) *Module {
	chatsManager := chats.NewManager(infra.MessagesRepository, logger)
	inputController := NewController(cfg, infra, chatsManager, logger)

	router := httprouter.New()
	router.HandlerFunc(http.MethodGet, "/connect", inputController.Connect)

	return &Module{
		Router: router,
	}
}
