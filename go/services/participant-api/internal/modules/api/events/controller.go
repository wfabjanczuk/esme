package events

import (
	"database/sql"
	"errors"
	"fmt"
	"github.com/julienschmidt/httprouter"
	"log"
	"net/http"
	"participant-api/internal/modules/api/common/responses"
	"participant-api/internal/modules/infrastructure/events"
	"strconv"
	"time"
)

type Controller struct {
	eventsRepository *events.Repository
	responder        *responses.Responder
	logger           *log.Logger
}

func NewController(eventsRepository *events.Repository, logger *log.Logger) *Controller {
	return &Controller{
		eventsRepository: eventsRepository,
		responder:        responses.NewResponder(logger),
		logger:           logger,
	}
}

func (c *Controller) parseTimeFilter(field, value string) (time.Time, error) {
	if value == "" {
		return time.Time{}, nil
	}

	t, err := time.Parse(time.RFC3339, value)
	if err != nil {
		return t, errors.New(fmt.Sprintf("invalid format of `%s` filter value; RFC3339 required", field))
	}
	return t, nil
}

func (c *Controller) FindEvents(w http.ResponseWriter, r *http.Request) {
	var err error
	queryFilters := r.URL.Query()
	filters := events.Filters{
		Query: queryFilters.Get("query"),
	}

	filters.From, err = c.parseTimeFilter("from", queryFilters.Get("from"))
	if err != nil {
		c.responder.WriteError(w, err, http.StatusBadRequest)
		return
	}
	filters.To, err = c.parseTimeFilter("to", queryFilters.Get("to"))
	if err != nil {
		c.responder.WriteError(w, err, http.StatusBadRequest)
		return
	}

	eventsList, err := c.eventsRepository.FindEvents(filters, 20)
	if err != nil {
		c.logger.Println(err)
		c.responder.WriteError(w, errors.New("could not fetch events"), http.StatusInternalServerError)
		return
	}

	c.responder.WriteJson(w, http.StatusOK, eventsList)
}

func (c *Controller) GetEvent(w http.ResponseWriter, r *http.Request) {
	idString := httprouter.ParamsFromContext(r.Context()).ByName("id")
	id, err := strconv.Atoi(idString)
	if err != nil {
		c.logger.Println(err)
		c.responder.WriteError(w, errors.New("invalid `id` query parameter"), http.StatusBadRequest)
		return
	}

	event, err := c.eventsRepository.GetEventById(id)
	if err == sql.ErrNoRows {
		c.responder.WriteError(w, errors.New(fmt.Sprintf("event with id %d not found", id)), http.StatusNotFound)
		return
	}
	if err != nil {
		c.logger.Println(err)
		c.responder.WriteError(w, errors.New("could not fetch event"), http.StatusInternalServerError)
		return
	}

	c.responder.WriteJson(w, http.StatusOK, event)
}
