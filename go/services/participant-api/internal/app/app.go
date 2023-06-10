package app

import (
	"log"
	"net/http"
	"os"
	"participant-api/internal/config"
	"participant-api/internal/modules/api"
	"participant-api/internal/modules/infrastructure"
	"time"
)

type Application struct {
	config *config.Config
	logger *log.Logger
}

func NewApplication() *Application {
	logger := log.New(os.Stdout, "", log.Ldate|log.Ltime|log.Llongfile)
	cfg := config.GetConfigFromEnv(logger)

	return &Application{
		config: cfg,
		logger: logger,
	}
}

func (a *Application) Bootstrap() {
	infrastructureModule := infrastructure.NewModule(a.config, a.logger)
	defer infrastructureModule.MqConnection.Close()
	defer infrastructureModule.MqChannel.Close()

	apiModule := api.NewModule(a.config, infrastructureModule, a.logger)

	srv := &http.Server{
		Addr:         ":8080",
		Handler:      apiModule.Router,
		IdleTimeout:  time.Minute,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}
	a.logger.Println("starting server on port 8080")
	a.logger.Panicln(srv.ListenAndServe())
}
