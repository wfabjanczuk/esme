package events

import (
	"github.com/julienschmidt/httprouter"
	"log"
	"net/http"
	"participant-api/internal/modules/api/common/api_errors"
	"participant-api/internal/modules/api/common/requests"
	"participant-api/internal/modules/api/common/responses"
	"participant-api/internal/modules/infrastructure/chat_requests"
	"participant-api/internal/modules/infrastructure/events"
	"strconv"
	"time"
)

type Controller struct {
	eventsRepository       *events.Repository
	chatRequestsRepository *chat_requests.Repository
	responder              *responses.Responder
	logger                 *log.Logger
}

func NewController(
	eventsRepository *events.Repository, chatRequestsRepository *chat_requests.Repository, logger *log.Logger,
) *Controller {
	return &Controller{
		eventsRepository:       eventsRepository,
		chatRequestsRepository: chatRequestsRepository,
		responder:              responses.NewResponder(logger),
		logger:                 logger,
	}
}

func (c *Controller) parseTimeFilter(field, value string) (time.Time, error) {
	if value == "" {
		return time.Time{}, nil
	}

	t, err := time.Parse(time.RFC3339, value)
	if err != nil {
		return t, api_errors.NewErrInvalidTimeFilter(field)
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

	eventsList, err := c.eventsRepository.FindEvents(filters)
	if err != nil {
		c.logger.Println(err)
		c.responder.WriteError(w, api_errors.ErrApi, http.StatusInternalServerError)
		return
	}

	c.responder.WriteJson(w, http.StatusOK, eventsList)
}

type userEvent struct {
	events.Event
	IsChatRequested bool `json:"isChatRequested"`
}

func (c *Controller) GetEvent(w http.ResponseWriter, r *http.Request) {
	idString := httprouter.ParamsFromContext(r.Context()).ByName("id")
	id, err := strconv.Atoi(idString)
	if err != nil {
		c.logger.Println(err)
		c.responder.WriteError(w, api_errors.ErrInvalidRouteId, http.StatusBadRequest)
		return
	}

	rawEvent, err := c.eventsRepository.GetEventById(id)
	if err == api_errors.ErrApiResourceNotFound {
		c.responder.WriteError(w, api_errors.NewErrEventNotFound(id), http.StatusNotFound)
		return
	}
	if err != nil {
		c.logger.Println(err)
		c.responder.WriteError(w, api_errors.ErrApi, http.StatusInternalServerError)
		return
	}

	user, err := requests.GetCurrentUser(r)
	if err != nil {
		c.logger.Println(err)
		c.responder.WriteError(w, api_errors.ErrUnexpected, http.StatusInternalServerError)
		return
	}

	event := &userEvent{
		Event: *rawEvent,
	}
	event.IsChatRequested, err = c.chatRequestsRepository.DoesChatRequestExist(user.Id, rawEvent.Id)
	if err != nil {
		c.logger.Println(err)
		c.responder.WriteError(w, api_errors.ErrDatabase, http.StatusInternalServerError)
		return
	}

	c.responder.WriteJson(w, http.StatusOK, event)
}
