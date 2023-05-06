package rest

import (
	"github.com/julienschmidt/httprouter"
	"log"
	"messenger-api/internal/modules/common/middlewares"
	"messenger-api/internal/modules/infrastructure"
	"messenger-api/internal/modules/rest/controllers/chats"
	"net/http"
)

type Module struct {
	chats *chats.Controller
}

func NewModule(
	mw *middlewares.Module, infra *infrastructure.Module, router *httprouter.Router, logger *log.Logger,
) *Module {
	m := &Module{chats: chats.NewController(infra, logger)}
	m.attachRoutes(router, mw.CurrentOrganizer.HandlerFunc, mw.CurrentParticipant.HandlerFunc)
	return m
}

func (m *Module) attachRoutes(
	r *httprouter.Router, co func(http.HandlerFunc) http.HandlerFunc, cp func(http.HandlerFunc) http.HandlerFunc,
) {
	r.HandlerFunc(http.MethodGet, "/agency/chats", co(m.chats.GetAgencyChats))
	r.HandlerFunc(http.MethodGet, "/agency/chats/:chatId/messages", co(m.chats.GetAgencyChatMessages))
	r.HandlerFunc(http.MethodGet, "/participant/chats", cp(m.chats.GetParticipantChats))
	r.HandlerFunc(http.MethodGet, "/participant/chats/:chatId/messages", cp(m.chats.GetParticipantChatMessages))
}
