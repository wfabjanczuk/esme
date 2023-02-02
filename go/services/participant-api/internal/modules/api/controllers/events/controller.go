package events

import (
	"database/sql"
	"github.com/julienschmidt/httprouter"
	"log"
	"net/http"
	"participant-api/internal/modules/api/common/requests"
	"participant-api/internal/modules/api/common/responses"
	"participant-api/internal/modules/infrastructure/events"
	"participant-api/internal/modules/infrastructure/subscriptions"
	"participant-api/internal/modules/infrastructure/users"
	"strconv"
	"time"
)

type Controller struct {
	eventsRepository        *events.Repository
	subscriptionsRepository *subscriptions.Repository
	responder               *responses.Responder
	logger                  *log.Logger
}

func NewController(
	eventsRepository *events.Repository, subscriptionsRepository *subscriptions.Repository, logger *log.Logger,
) *Controller {
	return &Controller{
		eventsRepository:        eventsRepository,
		subscriptionsRepository: subscriptionsRepository,
		responder:               responses.NewResponder(logger),
		logger:                  logger,
	}
}

func (c *Controller) parseTimeFilter(field, value string) (time.Time, error) {
	if value == "" {
		return time.Time{}, nil
	}

	t, err := time.Parse(time.RFC3339, value)
	if err != nil {
		return t, responses.NewErrInvalidTimeFilter(field)
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
		c.responder.WriteError(w, responses.ErrDatabase, http.StatusInternalServerError)
		return
	}

	c.responder.WriteJson(w, http.StatusOK, eventsList)
}

type getEventOnSuccess func(http.ResponseWriter, *http.Request, *users.User, *events.Event)

func (c *Controller) getEvent(w http.ResponseWriter, r *http.Request, onSuccess getEventOnSuccess) {
	idString := httprouter.ParamsFromContext(r.Context()).ByName("id")
	id, err := strconv.Atoi(idString)
	if err != nil {
		c.logger.Println(err)
		c.responder.WriteError(w, responses.ErrInvalidQueryId, http.StatusBadRequest)
		return
	}

	event, err := c.eventsRepository.GetEventById(id)
	if err == sql.ErrNoRows {
		c.responder.WriteError(w, responses.NewErrEventNotFound(id), http.StatusNotFound)
		return
	}
	if err != nil {
		c.logger.Println(err)
		c.responder.WriteError(w, responses.ErrDatabase, http.StatusInternalServerError)
		return
	}

	user, err := requests.GetCurrentUser(r)
	if err != nil {
		c.logger.Println(err)
		c.responder.WriteError(w, responses.ErrUnexpected, http.StatusInternalServerError)
		return
	}

	onSuccess(w, r, user, event)
}

func (c *Controller) GetEvent(w http.ResponseWriter, r *http.Request) {
	c.getEvent(
		w, r, func(w http.ResponseWriter, r *http.Request, user *users.User, event *events.Event) {
			c.responder.WriteJson(w, http.StatusOK, event)
		},
	)
}

func (c *Controller) Subscribe(w http.ResponseWriter, r *http.Request) {
	c.getEvent(
		w, r, func(w http.ResponseWriter, r *http.Request, user *users.User, event *events.Event) {
			err := c.subscriptionsRepository.Subscribe(user.Id, event.Id)
			if err != nil {
				c.logger.Println(err)
				c.responder.WriteError(w, responses.ErrDatabase, http.StatusInternalServerError)
				return
			}

			c.responder.WriteEmptyResponse(w, http.StatusOK)
		},
	)
}

func (c *Controller) Unsubscribe(w http.ResponseWriter, r *http.Request) {
	c.getEvent(
		w, r, func(w http.ResponseWriter, r *http.Request, user *users.User, event *events.Event) {
			err := c.subscriptionsRepository.Unsubscribe(user.Id, event.Id)
			if err != nil {
				c.logger.Println(err)
				c.responder.WriteError(w, responses.ErrDatabase, http.StatusInternalServerError)
				return
			}

			c.responder.WriteEmptyResponse(w, http.StatusOK)
		},
	)
}
