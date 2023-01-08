package users

import (
	"github.com/julienschmidt/httprouter"
	"log"
	"net/http"
	"participant-api/internal/config"
	"participant-api/internal/database"
)

type UsersModule struct {
	authController    *authController
	profileController *profileController
	AuthMiddleware    func(next func(w http.ResponseWriter, r *http.Request)) http.HandlerFunc
}

func NewUsersModule(logger *log.Logger, config *config.Config, router *httprouter.Router) *UsersModule {
	db := database.SetupConnection(config.ParticipantDSN, logger)
	usersRepository := newUsersRepository(logger, db)
	authController := newAuthController(
		usersRepository,
		config.JWTSecret,
		logger,
	)
	profileController := newProfileController(
		usersRepository,
		logger,
	)
	m := &UsersModule{
		authController:    authController,
		profileController: profileController,
		AuthMiddleware:    authController.Authenticate,
	}

	m.attachRoutes(router)
	return m
}

func (m *UsersModule) attachRoutes(router *httprouter.Router) {
	router.HandlerFunc(http.MethodPost, "/auth/sign-up", m.authController.signUp)
	router.HandlerFunc(http.MethodPost, "/auth/sign-in", m.authController.signIn)
	router.HandlerFunc(http.MethodPost, "/auth/sign-out", m.AuthMiddleware(m.authController.signOut))

	router.HandlerFunc(http.MethodGet, "/profile", m.AuthMiddleware(m.profileController.getProfile))
	router.HandlerFunc(http.MethodPatch, "/profile", m.AuthMiddleware(m.profileController.updateProfile))
	router.HandlerFunc(http.MethodPatch, "/profile/change-password",
		m.AuthMiddleware(m.profileController.changePassword),
	)
}
