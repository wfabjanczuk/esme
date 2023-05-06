package chat_requests

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"participant-api/internal/modules/api/common/api_errors"
	"participant-api/internal/modules/api/common/requests"
	"participant-api/internal/modules/api/common/responses"
	"participant-api/internal/modules/infrastructure/chat_requests"
	"participant-api/internal/modules/infrastructure/events"
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
	if err == api_errors.ErrApiResourceNotFound {
		c.responder.WriteError(w, api_errors.NewErrEventNotFound(doesChatRequestExistDto.EventId), http.StatusNotFound)
		return
	}
	if err != nil {
		c.logger.Println(err)
		c.responder.WriteError(w, api_errors.ErrDatabase, http.StatusInternalServerError)
	}

	doesChatRequestExist, err := c.chatRequestsRepository.DoesChatRequestExist(user.Id, event.Id)
	if err != nil {
		c.logger.Println(err)
		c.responder.WriteError(w, api_errors.ErrDatabase, http.StatusInternalServerError)
	}

	c.responder.WriteJson(w, http.StatusOK, doesChatRequestExistResponse{Result: doesChatRequestExist})
}

func (c *Controller) CreateChatRequest(w http.ResponseWriter, r *http.Request) {
	chatRequest, err, errStatus := c.buildChatRequest(r)
	if err != nil {
		c.responder.WriteError(w, err, errStatus)
		return
	}

	err = c.chatRequestsRepository.CreateChatRequest(chatRequest)
	if err == api_errors.ErrChatRequestExists {
		c.responder.WriteError(w, err, http.StatusBadRequest)
		return
	}
	if err != nil {
		c.logger.Println(err)
		c.responder.WriteError(w, api_errors.ErrDatabase, http.StatusInternalServerError)
		return
	}

	c.responder.WriteEmptyResponse(w, http.StatusOK)
}

func (c *Controller) buildChatRequest(r *http.Request) (*chat_requests.ChatRequestMq, error, int) {
	user, err := requests.GetCurrentUser(r)
	if err != nil {
		c.logger.Println(err)
		return nil, api_errors.ErrUnexpected, http.StatusInternalServerError
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		return nil, err, http.StatusBadRequest
	}

	createChatRequestDto := &createChatRequestDto{}
	err = json.Unmarshal(body, createChatRequestDto)
	if err != nil {
		return nil, err, http.StatusBadRequest
	}
	if err = createChatRequestDto.validate(); err != nil {
		return nil, err, http.StatusBadRequest
	}

	event, err := c.eventsRepository.GetEventById(createChatRequestDto.EventId)
	if err == api_errors.ErrApiResourceNotFound {
		return nil, api_errors.NewErrEventNotFound(createChatRequestDto.EventId), http.StatusNotFound
	}
	if err != nil {
		c.logger.Println(err)
		return nil, api_errors.ErrDatabase, http.StatusInternalServerError
	}

	return &chat_requests.ChatRequestMq{
		ParticipantId: user.Id,
		AgencyId:      event.AgencyId,
		EventId:       createChatRequestDto.EventId,
		Description:   createChatRequestDto.Description,
		Lat:           createChatRequestDto.Lat,
		Lng:           createChatRequestDto.Lng,
	}, nil, 0
}

func (c *Controller) DeleteChatRequest(w http.ResponseWriter, r *http.Request) {
	body, err := io.ReadAll(r.Body)
	if err != nil {
		c.responder.WriteError(w, err, http.StatusBadRequest)
		return
	}

	deleteChatRequestDto := &deleteChatRequestDto{}
	err = json.Unmarshal(body, deleteChatRequestDto)
	if err != nil {
		c.responder.WriteError(w, err, http.StatusBadRequest)
		return
	}

	err = c.chatRequestsRepository.DeleteChatRequest(deleteChatRequestDto.ParticipantId, deleteChatRequestDto.EventId)
	if err != nil {
		c.logger.Println(err)
		c.responder.WriteError(w, api_errors.ErrDatabase, http.StatusInternalServerError)
		return
	}

	c.responder.WriteEmptyResponse(w, http.StatusOK)
}
