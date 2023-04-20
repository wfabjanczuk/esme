package ws

import (
	"github.com/julienschmidt/httprouter"
	"log"
	"messenger-api/internal/config"
	"messenger-api/internal/modules/infrastructure"
	"messenger-api/internal/modules/ws/layers/chats"
	"messenger-api/internal/modules/ws/layers/users"
	"net/http"
)

type Module struct {
	Router http.Handler
}

func NewModule(cfg *config.Config, infra *infrastructure.Module, logger *log.Logger) *Module {
	organizersManager := users.NewOrganizersManager(logger)
	participantsManager := users.NewParticipantsManager(logger)
	chatsManager := chats.NewManager(infra, organizersManager, participantsManager, logger)

	controller := NewController(cfg, infra, chatsManager, logger)
	router := httprouter.New()
	router.HandlerFunc(http.MethodGet, "/connect", controller.Connect)

	return &Module{
		Router: router,
	}
}
