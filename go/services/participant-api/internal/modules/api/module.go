package api

import (
	"github.com/julienschmidt/httprouter"
	"log"
	"net/http"
	"participant-api/internal/config"
	"participant-api/internal/modules/api/common/middlewares"
	currentUser "participant-api/internal/modules/api/common/middlewares/current-user"
	"participant-api/internal/modules/api/controllers/auth"
	"participant-api/internal/modules/api/controllers/events"
	"participant-api/internal/modules/api/controllers/profile"
	"participant-api/internal/modules/infrastructure"
)

type Module struct {
	Router  http.Handler
	auth    *auth.Controller
	profile *profile.Controller
	events  *events.Controller
}

func NewModule(cfg *config.Config, infra *infrastructure.Module, logger *log.Logger) *Module {
	router := httprouter.New()
	mw := middlewares.NewModule(cfg.JwtSecret, infra.UsersRepository, logger)

	module := &Module{
		Router:  mw.EnableCors.Handler(router),
		auth:    auth.NewController(cfg.JwtSecret, infra.UsersRepository, logger),
		profile: profile.NewController(infra.UsersRepository, logger),
		events:  events.NewController(infra.EventsRepository, infra.SubscriptionsRepository, logger),
	}

	module.attachRoutes(router, mw.CurrentUser)
	return module
}

func (m *Module) attachRoutes(r *httprouter.Router, cu *currentUser.Middleware) {
	r.HandlerFunc(http.MethodPost, "/auth/sign-up", m.auth.SignUp)
	r.HandlerFunc(http.MethodPost, "/auth/sign-in", m.auth.SignIn)
	r.HandlerFunc(http.MethodPost, "/auth/sign-out", cu.HandlerFunc(m.auth.SignOut))

	r.HandlerFunc(http.MethodGet, "/profile", cu.HandlerFunc(m.profile.GetProfile))
	r.HandlerFunc(http.MethodPatch, "/profile", cu.HandlerFunc(m.profile.UpdateProfile))
	r.HandlerFunc(http.MethodDelete, "/profile", cu.HandlerFunc(m.profile.DeleteProfile))
	r.HandlerFunc(http.MethodPatch, "/profile/change-password", cu.HandlerFunc(m.profile.ChangePassword))

	r.HandlerFunc(http.MethodGet, "/events", cu.HandlerFunc(m.events.FindEvents))
	r.HandlerFunc(http.MethodGet, "/events/:id", cu.HandlerFunc(m.events.GetEvent))
	r.HandlerFunc(http.MethodPost, "/events/:id/subscribe", cu.HandlerFunc(m.events.Subscribe))
	r.HandlerFunc(http.MethodPost, "/events/:id/unsubscribe", cu.HandlerFunc(m.events.Unsubscribe))
}
