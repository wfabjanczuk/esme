package ws

import (
	"github.com/gorilla/websocket"
	"log"
	"messenger-api/internal/config"
	"messenger-api/internal/modules/authentication"
	"messenger-api/internal/modules/infrastructure"
	"messenger-api/internal/modules/infrastructure/chats"
	"messenger-api/internal/modules/ws/consumers/organizers"
	"messenger-api/internal/modules/ws/consumers/participants"
	mgmt_chats "messenger-api/internal/modules/ws/managers/chats"
	"net/http"
)

var wsUpgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

type Controller struct {
	authenticator        *authentication.Authenticator
	chatsRepository      *chats.Repository
	out                  *mgmt_chats.Manager
	organizersConsumer   *organizers.Consumer
	participantsConsumer *participants.Consumer
	logger               *log.Logger
}

func NewController(
	cfg *config.Config, infra *infrastructure.Module, chatsManager *mgmt_chats.Manager, logger *log.Logger,
) *Controller {
	return &Controller{
		authenticator:        authentication.NewAuthenticator(cfg, logger),
		chatsRepository:      infra.ChatsRepository,
		organizersConsumer:   organizers.NewConsumer(infra, chatsManager, logger),
		participantsConsumer: participants.NewConsumer(infra, chatsManager, logger),
		out:                  chatsManager,
		logger:               logger,
	}
}

func (c *Controller) Connect(w http.ResponseWriter, r *http.Request) {
	parseHeaderResult := c.authenticator.ParseHeader(r.Header.Get("Authorization"))
	if parseHeaderResult.Err != nil {
		c.logger.Printf("could not open connection for client %s: %s\n", r.RemoteAddr, parseHeaderResult.Err)
		return
	}

	if parseHeaderResult.IsOrganizer {
		c.connectOrganizer(w, r, parseHeaderResult.Token)
	} else {
		c.connectParticipant(w, r, parseHeaderResult.Token)
	}
}
