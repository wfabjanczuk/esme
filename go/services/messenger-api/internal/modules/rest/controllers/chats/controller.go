package chats

import (
	"github.com/julienschmidt/httprouter"
	"log"
	"messenger-api/internal/modules/common"
	"messenger-api/internal/modules/infrastructure"
	"messenger-api/internal/modules/infrastructure/chats"
	"messenger-api/internal/modules/infrastructure/messages"
	"messenger-api/internal/modules/infrastructure/participants"
	"messenger-api/internal/modules/rest/common/requests"
	"messenger-api/internal/modules/rest/common/responses"
	"net/http"
)

type Controller struct {
	chatsRepository        *chats.Repository
	messagesRepository     *messages.Repository
	participantsRepository *participants.Repository
	responder              *responses.Responder
	logger                 *log.Logger
}

func NewController(infra *infrastructure.Module, logger *log.Logger) *Controller {
	return &Controller{
		chatsRepository:        infra.ChatsRepository,
		messagesRepository:     infra.MessagesRepository,
		participantsRepository: infra.ParticipantsRepository,
		responder:              responses.NewResponder(logger),
		logger:                 logger,
	}
}

func (c *Controller) GetChatParticipant(w http.ResponseWriter, r *http.Request) {
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

	participant, err := c.participantsRepository.FindOne(chat.ParticipantId)
	if err != nil {
		c.logger.Println(err)
		c.responder.WriteError(w, common.ErrParticipantNotFound, http.StatusBadRequest)
		return
	}

	c.responder.WriteJson(w, http.StatusOK, participant)
}
