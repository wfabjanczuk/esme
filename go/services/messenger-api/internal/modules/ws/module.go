package ws

import (
	"github.com/julienschmidt/httprouter"
	"log"
	"messenger-api/internal/config"
	"messenger-api/internal/modules/infrastructure"
	"messenger-api/internal/modules/ws/writers/chats"
	"net/http"
)

type Module struct {
	Router http.Handler
}

func NewModule(cfg *config.Config, infra *infrastructure.Module, logger *log.Logger) *Module {
	chatsWriter := chats.NewWriter(infra.MessagesRepository)
	inputController := NewController(cfg, infra, chatsWriter, logger)

	router := httprouter.New()
	router.HandlerFunc(http.MethodGet, "/connect", inputController.Connect)

	return &Module{
		Router: router,
	}
}
