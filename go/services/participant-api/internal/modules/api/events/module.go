package events

import (
	"github.com/julienschmidt/httprouter"
	"log"
	"net/http"
	currentUser "participant-api/internal/modules/api/common/middlewares/current-user"
	"participant-api/internal/modules/infrastructure"
)

type Module struct {
	eventsController *Controller
	currentUser      *currentUser.Middleware
}

func NewModule(
	infrastructureModule *infrastructure.Module, currentUser *currentUser.Middleware, router *httprouter.Router,
	logger *log.Logger,
) *Module {
	m := &Module{
		eventsController: NewController(
			infrastructureModule.EventsRepository, infrastructureModule.SubscriptionsRepository, logger,
		),
		currentUser: currentUser,
	}
	m.attachRoutes(router)
	return m
}

func (m *Module) attachRoutes(router *httprouter.Router) {
	router.HandlerFunc(http.MethodGet, "/events", m.currentUser.HandlerFunc(m.eventsController.FindEvents))
	router.HandlerFunc(http.MethodGet, "/events/:id", m.currentUser.HandlerFunc(m.eventsController.GetEvent))
	router.HandlerFunc(
		http.MethodPost, "/events/:id/subscribe", m.currentUser.HandlerFunc(m.eventsController.Subscribe),
	)
	router.HandlerFunc(
		http.MethodPost, "/events/:id/unsubscribe", m.currentUser.HandlerFunc(m.eventsController.Unsubscribe),
	)
}
