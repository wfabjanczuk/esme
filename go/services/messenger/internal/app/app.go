package app

import (
	"fmt"
	"github.com/julienschmidt/httprouter"
	amqp "github.com/rabbitmq/amqp091-go"
	"log"
	"messenger/internal/config"
	"messenger/internal/modules/api"
	"messenger/internal/modules/storage"
	"messenger/internal/queue"
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
	connection, channel := queue.SetupConnection(cfg.QueueDsn, logger)

	return &Application{
		Config:          cfg,
		QueueConnection: connection,
		QueueChannel:    channel,
		Logger:          logger,
	}
}

func (a *Application) Bootstrap() {
	router := httprouter.New()
	storageModule := storage.NewModule(a.Config, a.Logger)
	api.NewModule(a.Config, a.Logger, storageModule, router)

	srv := &http.Server{
		Addr:         fmt.Sprintf(":%d", a.Config.Port),
		Handler:      router,
		IdleTimeout:  time.Minute,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	a.Logger.Printf("Starting %s server on port %d", a.Config.Env, a.Config.Port)
	a.Logger.Panic(srv.ListenAndServe())
}
