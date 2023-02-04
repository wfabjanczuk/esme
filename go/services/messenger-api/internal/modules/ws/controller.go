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
	writers_chats "messenger-api/internal/modules/ws/writers/chats"
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
	out                  *writers_chats.Writer
	organizersConsumer   *organizers.Consumer
	participantsConsumer *participants.Consumer
	logger               *log.Logger
}

func NewController(
	cfg *config.Config, infra *infrastructure.Module, outputController *writers_chats.Writer, logger *log.Logger,
) *Controller {
	return &Controller{
		authenticator:        authentication.NewAuthenticator(cfg, logger),
		chatsRepository:      infra.ChatsRepository,
		organizersConsumer:   organizers.NewConsumer(infra, outputController, logger),
		participantsConsumer: participants.NewConsumer(outputController, logger),
		out:                  outputController,
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
