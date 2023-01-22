package app

import (
	"fmt"
	"github.com/julienschmidt/httprouter"
	"log"
	"net/http"
	"os"
	"participant-api/internal/config"
	"participant-api/internal/middlewares"
	"participant-api/internal/modules/users"
	"time"
)

type Application struct {
	Config *config.Config
	Logger *log.Logger
}

func NewApplication() *Application {
	logger := log.New(os.Stdout, "", log.Ldate|log.Ltime|log.Llongfile)
	cfg := config.GetConfigFromEnv(logger)

	return &Application{
		Config: cfg,
		Logger: logger,
	}
}

func (a *Application) Bootstrap() {
	router := httprouter.New()
	usersModule := users.NewUsersModule(a.Logger, a.Config, router)
	defer usersModule.ParticipantDB.Close()

	srv := &http.Server{
		Addr:         fmt.Sprintf(":%d", a.Config.Port),
		Handler:      middlewares.EnableCors{Handler: router},
		IdleTimeout:  time.Minute,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}
	a.Logger.Printf("Starting %s server on port %d", a.Config.Env, a.Config.Port)
	a.Logger.Panic(srv.ListenAndServe())
}
