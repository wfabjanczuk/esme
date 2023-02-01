package users

import (
	"github.com/julienschmidt/httprouter"
	"log"
	"net/http"
	"participant-api/internal/config"
	currentUser "participant-api/internal/modules/api/common/middlewares/current-user"
	"participant-api/internal/modules/api/users/auth"
	"participant-api/internal/modules/api/users/profile"
	"participant-api/internal/modules/infrastructure"
)

type Module struct {
	authController    *auth.Controller
	profileController *profile.Controller
	currentUser       *currentUser.Middleware
}

func NewModule(
	cfg *config.Config, infrastructureModule *infrastructure.Module, currentUser *currentUser.Middleware,
	router *httprouter.Router, logger *log.Logger,
) *Module {
	m := &Module{
		authController: auth.NewController(
			cfg.JwtSecret,
			infrastructureModule.UsersRepository,
			logger,
		),
		profileController: profile.NewController(
			infrastructureModule.UsersRepository,
			logger,
		),
		currentUser: currentUser,
	}

	m.attachRoutes(router)
	return m
}

func (m *Module) attachRoutes(router *httprouter.Router) {
	router.HandlerFunc(http.MethodPost, "/auth/sign-up", m.authController.SignUp)
	router.HandlerFunc(http.MethodPost, "/auth/sign-in", m.authController.SignIn)
	router.HandlerFunc(http.MethodPost, "/auth/sign-out", m.currentUser.HandlerFunc(m.authController.SignOut))

	router.HandlerFunc(http.MethodGet, "/profile", m.currentUser.HandlerFunc(m.profileController.GetProfile))
	router.HandlerFunc(http.MethodPatch, "/profile", m.currentUser.HandlerFunc(m.profileController.UpdateProfile))
	router.HandlerFunc(http.MethodDelete, "/profile", m.currentUser.HandlerFunc(m.profileController.DeleteProfile))
	router.HandlerFunc(
		http.MethodPatch, "/profile/change-password", m.currentUser.HandlerFunc(m.profileController.ChangePassword),
	)
}
