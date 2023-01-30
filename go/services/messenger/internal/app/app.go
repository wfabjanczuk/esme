package app

import (
	"fmt"
	"github.com/julienschmidt/httprouter"
	"log"
	"messenger/internal/config"
	"messenger/internal/modules/api"
	"messenger/internal/modules/infrastructure"
	"net/http"
	"os"
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
	infrastructureModule := infrastructure.NewModule(a.Config, a.Logger)
	api.NewModule(a.Config, a.Logger, infrastructureModule, router)

	srv := &http.Server{
		Addr:         fmt.Sprintf(":%d", a.Config.Port),
		Handler:      router,
		IdleTimeout:  time.Minute,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	a.Logger.Printf("starting %s server on port %d\n", a.Config.Env, a.Config.Port)
	a.Logger.Panicln(srv.ListenAndServe())
}
