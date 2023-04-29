package api

import (
	"github.com/julienschmidt/httprouter"
	"log"
	"net/http"
	"participant-api/internal/config"
	"participant-api/internal/modules/api/common/middlewares"
	"participant-api/internal/modules/api/controllers/auth"
	"participant-api/internal/modules/api/controllers/chat_requests"
	"participant-api/internal/modules/api/controllers/events"
	"participant-api/internal/modules/api/controllers/profile"
	"participant-api/internal/modules/api/controllers/users"
	"participant-api/internal/modules/infrastructure"
)

type Module struct {
	Router       http.Handler
	auth         *auth.Controller
	profile      *profile.Controller
	events       *events.Controller
	chatRequests *chat_requests.Controller
	users        *users.Controller
}

func NewModule(cfg *config.Config, infra *infrastructure.Module, logger *log.Logger) *Module {
	router := httprouter.New()
	mw := middlewares.NewModule(cfg.JwtSecret, cfg.ParticipantApiKey, infra.UsersRepository, logger)

	module := &Module{
		Router:  mw.EnableCors.Handler(router),
		auth:    auth.NewController(cfg.JwtSecret, infra.UsersRepository, logger),
		profile: profile.NewController(infra.UsersRepository, logger),
		events: events.NewController(
			infra.EventsRepository, infra.ChatRequestsRepository, logger,
		),
		chatRequests: chat_requests.NewController(infra.EventsRepository, infra.ChatRequestsRepository, logger),
		users:        users.NewController(infra.UsersRepository, logger),
	}

	module.attachRoutes(router, mw.CurrentUser.HandlerFunc, mw.ApiKey.HandlerFunc)
	return module
}

func (m *Module) attachRoutes(
	r *httprouter.Router, cu func(http.HandlerFunc) http.HandlerFunc, ak func(http.HandlerFunc) http.HandlerFunc,
) {
	r.HandlerFunc(http.MethodPost, "/auth/sign-up", m.auth.SignUp)
	r.HandlerFunc(http.MethodPost, "/auth/sign-in", m.auth.SignIn)
	r.HandlerFunc(http.MethodPost, "/auth/sign-out", cu(m.auth.SignOut))

	r.HandlerFunc(http.MethodGet, "/profile", cu(m.profile.GetProfile))
	r.HandlerFunc(http.MethodPatch, "/profile", cu(m.profile.UpdateProfile))
	r.HandlerFunc(http.MethodDelete, "/profile", cu(m.profile.DeleteProfile))
	r.HandlerFunc(http.MethodPatch, "/profile/change-password", cu(m.profile.ChangePassword))

	r.HandlerFunc(http.MethodGet, "/events", cu(m.events.FindEvents))
	r.HandlerFunc(http.MethodGet, "/events/:id", cu(m.events.GetEvent))

	r.HandlerFunc(http.MethodGet, "/chat-requests", cu(m.chatRequests.DoesChatRequestExist))
	r.HandlerFunc(http.MethodPost, "/chat-requests", cu(m.chatRequests.RequestChat))

	r.HandlerFunc(http.MethodGet, "/users", ak(m.users.GetUsers))
}
