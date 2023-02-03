package chats

import (
	"database/sql"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"participant-api/internal/modules/api/common/api_errors"
	"participant-api/internal/modules/api/common/requests"
	"participant-api/internal/modules/api/common/responses"
	"participant-api/internal/modules/infrastructure/chats"
	"participant-api/internal/modules/infrastructure/events"
)

type Controller struct {
	eventsRepository *events.Repository
	chatsRepository  *chats.Repository
	responder        *responses.Responder
	logger           *log.Logger
}

func NewController(
	eventsRepository *events.Repository, chatsRepository *chats.Repository, logger *log.Logger,
) *Controller {
	return &Controller{
		eventsRepository: eventsRepository,
		chatsRepository:  chatsRepository,
		responder:        responses.NewResponder(logger),
		logger:           logger,
	}
}

func (c *Controller) DoesChatRequestExist(w http.ResponseWriter, r *http.Request) {
	user, err := requests.GetCurrentUser(r)
	if err != nil {
		c.logger.Println(err)
		c.responder.WriteError(w, api_errors.ErrUnexpected, http.StatusInternalServerError)
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		c.responder.WriteError(w, err, http.StatusBadRequest)
		return
	}

	doesChatRequestExistDto := &doesChatRequestExistDto{}
	err = json.Unmarshal(body, doesChatRequestExistDto)
	if err != nil {
		c.responder.WriteError(w, err, http.StatusBadRequest)
	}

	event, err := c.eventsRepository.GetEventById(doesChatRequestExistDto.EventId)
	if err == sql.ErrNoRows {
		c.responder.WriteError(w, api_errors.NewErrEventNotFound(doesChatRequestExistDto.EventId), http.StatusNotFound)
		return
	}
	if err != nil {
		c.logger.Println(err)
		c.responder.WriteError(w, api_errors.ErrDatabase, http.StatusInternalServerError)
	}

	doesChatRequestExist, err := c.chatsRepository.DoesChatRequestExist(user.Id, event.Id)
	if err != nil {
		c.logger.Println(err)
		c.responder.WriteError(w, api_errors.ErrDatabase, http.StatusInternalServerError)
	}

	c.responder.WriteJson(w, http.StatusOK, doesChatRequestExistResponse{Result: doesChatRequestExist})
}

func (c *Controller) RequestChat(w http.ResponseWriter, r *http.Request) {
	chatSetup, err, errStatus := c.buildChatSetup(r)
	if err != nil {
		c.responder.WriteError(w, err, errStatus)
		return
	}

	err = c.chatsRepository.RequestChat(chatSetup)
	if err == api_errors.ErrChatRequestExists {
		c.responder.WriteError(w, err, http.StatusBadRequest)
		return
	}
	if err != nil {
		c.logger.Println(err)
		c.responder.WriteError(w, api_errors.ErrDatabase, http.StatusInternalServerError)
		return
	}
}

func (c *Controller) buildChatSetup(r *http.Request) (*chats.ChatSetup, error, int) {
	user, err := requests.GetCurrentUser(r)
	if err != nil {
		c.logger.Println(err)
		return nil, api_errors.ErrUnexpected, http.StatusInternalServerError
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		return nil, err, http.StatusBadRequest
	}

	requestChatDto := &requestChatDto{}
	err = json.Unmarshal(body, requestChatDto)
	if err != nil {
		return nil, err, http.StatusBadRequest
	}
	if err = requestChatDto.validate(); err != nil {
		return nil, err, http.StatusBadRequest
	}

	event, err := c.eventsRepository.GetEventById(requestChatDto.EventId)
	if err == sql.ErrNoRows {
		return nil, api_errors.NewErrEventNotFound(requestChatDto.EventId), http.StatusNotFound
	}
	if err != nil {
		c.logger.Println(err)
		return nil, api_errors.ErrDatabase, http.StatusInternalServerError
	}

	return &chats.ChatSetup{
		ParticipantId: user.Id,
		AgencyId:      event.AgencyId,
		EventId:       requestChatDto.EventId,
		Description:   requestChatDto.Description,
		Lat:           requestChatDto.Lat,
		Lng:           requestChatDto.Lng,
	}, nil, 0
}
