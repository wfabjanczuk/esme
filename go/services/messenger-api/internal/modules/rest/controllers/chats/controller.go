package chats

import (
	"github.com/julienschmidt/httprouter"
	"log"
	"messenger-api/internal/modules/common"
	"messenger-api/internal/modules/infrastructure"
	"messenger-api/internal/modules/infrastructure/chats"
	"messenger-api/internal/modules/infrastructure/enriched_chats"
	"messenger-api/internal/modules/infrastructure/messages"
	"messenger-api/internal/modules/infrastructure/participants"
	"messenger-api/internal/modules/rest/requests"
	"messenger-api/internal/modules/rest/responses"
	"net/http"
)

type Controller struct {
	chatsRepository        *chats.Repository
	messagesRepository     *messages.Repository
	participantsRepository *participants.Repository
	enrichedChatsService   *enriched_chats.Service
	responder              *responses.Responder
	logger                 *log.Logger
}

func NewController(infra *infrastructure.Module, logger *log.Logger) *Controller {
	return &Controller{
		chatsRepository:        infra.ChatsRepository,
		messagesRepository:     infra.MessagesRepository,
		participantsRepository: infra.ParticipantsRepository,
		enrichedChatsService:   infra.EnrichedChatsService,
		responder:              responses.NewResponder(logger),
		logger:                 logger,
	}
}

func (c *Controller) GetAgencyChats(w http.ResponseWriter, r *http.Request) {
	organizer, err := requests.GetCurrentOrganizer(r)
	if err != nil {
		c.logger.Println(err)
		c.responder.WriteError(w, common.ErrUnexpected, http.StatusInternalServerError)
		return
	}

	chats, err := c.chatsRepository.FindAllByAgencyId(organizer.AgencyId)
	if err != nil {
		c.logger.Println(err)
		c.responder.WriteError(w, common.ErrChatNotFound, http.StatusBadRequest)
		return
	}

	enrichedChats := c.enrichedChatsService.EnrichWithParticipant(chats)
	c.responder.WriteJson(w, http.StatusOK, enrichedChats)
}

func (c *Controller) GetChatMessages(w http.ResponseWriter, r *http.Request) {
	organizer, err := requests.GetCurrentOrganizer(r)
	if err != nil {
		c.logger.Println(err)
		c.responder.WriteError(w, common.ErrUnexpected, http.StatusInternalServerError)
		return
	}

	chatId := httprouter.ParamsFromContext(r.Context()).ByName("chatId")
	chat, err := c.chatsRepository.FindOneInAgency(chatId, organizer.AgencyId)
	if err != nil {
		c.logger.Println(err)
		c.responder.WriteError(w, common.ErrChatNotFound, http.StatusBadRequest)
		return
	}

	chatMessages, err := c.messagesRepository.FindAll(chat.Id)
	if err != nil {
		c.logger.Println(err)
		c.responder.WriteError(w, common.ErrMessagesNotFetchedFromDb, http.StatusBadRequest)
		return
	}

	c.responder.WriteJson(w, http.StatusOK, chatMessages)
}
