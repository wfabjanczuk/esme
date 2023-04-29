package ws

import (
	"github.com/julienschmidt/httprouter"
	"log"
	"messenger-api/internal/modules/authentication"
	"messenger-api/internal/modules/infrastructure"
	"messenger-api/internal/modules/ws/chats"
	"messenger-api/internal/modules/ws/consumers/organizers"
	"messenger-api/internal/modules/ws/consumers/participants"
	"messenger-api/internal/modules/ws/users"
	"net/http"
)

type Module struct{}

func NewModule(
	authenticator *authentication.Authenticator, infra *infrastructure.Module, router *httprouter.Router,
	logger *log.Logger,
) *Module {
	organizersManager := users.NewOrganizersManager(logger)
	participantsManager := users.NewParticipantsManager(logger)

	chatsManager := chats.NewManager(infra, organizersManager, participantsManager, logger)
	organizersManager.SetConsumer(organizers.NewConsumer(infra, chatsManager, logger))
	participantsManager.SetConsumer(participants.NewConsumer(infra, chatsManager, logger))

	controller := NewController(authenticator, infra, chatsManager, logger)
	router.HandlerFunc(http.MethodGet, "/connect", controller.Connect)

	return &Module{}
}
