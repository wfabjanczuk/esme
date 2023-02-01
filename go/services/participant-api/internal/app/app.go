package app

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"participant-api/internal/config"
	"participant-api/internal/modules/api"
	"participant-api/internal/modules/infrastructure"
	"participant-api/internal/modules/infrastructure/events"
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
	apiModule := api.NewModule(a.config, infrastructureModule, a.logger)

	a.testInfrastructureModule(infrastructureModule)

	srv := &http.Server{
		Addr:         fmt.Sprintf(":%d", a.config.Port),
		Handler:      apiModule.Router,
		IdleTimeout:  time.Minute,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}
	a.logger.Printf("starting %s server on port %d\n", a.config.Env, a.config.Port)
	a.logger.Panicln(srv.ListenAndServe())
}

func (a *Application) testInfrastructureModule(im *infrastructure.Module) {
	eventsRepository := im.EventsRepository

	event, err := eventsRepository.GetEventById(1)
	if err != nil {
		a.logger.Fatal(err)
	}
	a.logger.Println(event)

	loc, err := time.LoadLocation("")
	if err != nil {
		a.logger.Fatal(err)
	}
	filters := events.Filters{
		Name:        "rap",
		Description: "event",
		Address:     "Warsaw",
		TimeStart:   time.Date(2022, 1, 1, 0, 0, 0, 0, loc),
		TimeEnd:     time.Date(2023, 1, 1, 0, 0, 0, 0, loc),
	}
	events, err := eventsRepository.FindEvents(filters, 20)
	if err != nil {
		a.logger.Fatal(err)
	}
	for i, e := range events {
		a.logger.Println("event", i, e)
	}
}
