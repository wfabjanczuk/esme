package app

import (
	"github.com/julienschmidt/httprouter"
	"log"
	"messenger-api/internal/config"
	"messenger-api/internal/modules/authentication"
	"messenger-api/internal/modules/common/middlewares"
	"messenger-api/internal/modules/infrastructure"
	"messenger-api/internal/modules/rest"
	"messenger-api/internal/modules/ws"
	"net/http"
	"os"
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

	authenticator := authentication.NewAuthenticator(a.config, a.logger)
	mw := middlewares.NewModule(authenticator, a.logger)

	router := httprouter.New()
	ws.NewModule(authenticator, infrastructureModule, router, a.logger)
	rest.NewModule(mw, infrastructureModule, router, a.logger)

	srv := &http.Server{
		Addr:         ":8080",
		Handler:      mw.EnableCors.Handler(router),
		IdleTimeout:  time.Minute,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}
	a.logger.Println("starting server on port 8080")
	a.logger.Panicln(srv.ListenAndServe())
}
