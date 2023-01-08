package app

import (
	"dispatcher/internal/config"
	"dispatcher/internal/middlewares"
	"dispatcher/internal/queue"
	"dispatcher/internal/requests"
	"dispatcher/internal/response"
	"fmt"
	"github.com/julienschmidt/httprouter"
	amqp "github.com/rabbitmq/amqp091-go"
	"log"
	"net/http"
	"os"
	"time"
)

type Application struct {
	Config          *config.Config
	QueueConnection *amqp.Connection
	QueueChannel    *amqp.Channel
	Logger          *log.Logger
}

func NewApplication() *Application {
	logger := log.New(os.Stdout, "", log.Ldate|log.Ltime|log.Llongfile)
	cfg := config.GetConfigFromEnv(logger)
	connection, channel := queue.SetupConnection(cfg.QueueDSN, logger)

	return &Application{
		Config:          cfg,
		QueueConnection: connection,
		QueueChannel:    channel,
		Logger:          logger,
	}
}

func (a *Application) Bootstrap() {
	router := httprouter.New()
	participantApiBasicAuth := middlewares.BasicAuth{
		Handler:      router,
		Responder:    response.NewResponder(a.Logger),
		Username:     a.Config.InParticipantApiUser,
		PasswordHash: a.Config.InParticipantApiPass,
	}
	requests.NewController(
		a.QueueConnection,
		a.QueueChannel,
		a.Logger,
		router,
	)

	srv := &http.Server{
		Addr:         fmt.Sprintf(":%d", a.Config.Port),
		Handler:      participantApiBasicAuth,
		IdleTimeout:  time.Minute,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}
	a.Logger.Printf("Starting %s server on port %d", a.Config.Env, a.Config.Port)

	err := srv.ListenAndServe()
	if err != nil {
		a.Logger.Println(err)
	}
}
