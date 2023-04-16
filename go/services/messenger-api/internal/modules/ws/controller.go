package ws

import (
	"github.com/gorilla/websocket"
	"log"
	"messenger-api/internal/config"
	"messenger-api/internal/modules/authentication"
	"messenger-api/internal/modules/infrastructure"
	"messenger-api/internal/modules/infrastructure/chats"
	mgmt_chats "messenger-api/internal/modules/ws/layers/chats"
	"net/http"
	"time"
)

const authorizationReadTimeout = time.Minute

var wsUpgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

type Controller struct {
	authenticator   *authentication.Authenticator
	chatsRepository *chats.Repository
	chatsManager    *mgmt_chats.Manager
	logger          *log.Logger
}

func NewController(
	cfg *config.Config, infra *infrastructure.Module, chatsManager *mgmt_chats.Manager, logger *log.Logger,
) *Controller {
	return &Controller{
		authenticator:   authentication.NewAuthenticator(cfg, logger),
		chatsRepository: infra.ChatsRepository,
		chatsManager:    chatsManager,
		logger:          logger,
	}
}

func (c *Controller) Connect(w http.ResponseWriter, r *http.Request) {
	wsConnection, err := wsUpgrader.Upgrade(w, r, nil)
	if err != nil {
		c.logger.Printf("could not upgrade connection %s: %s\n", r.RemoteAddr, err)
		return
	}

	authorizationHeader, err := c.readAuthorizationHeader(wsConnection)
	if err != nil {
		c.logger.Printf("could not read authorization message from %s: %s\n", r.RemoteAddr, err)
		wsConnection.Close()
		return
	}

	parseHeaderResult := c.authenticator.ParseHeader(authorizationHeader)
	if parseHeaderResult.Err != nil {
		c.logger.Printf("invalid authorization header %s: %s\n", r.RemoteAddr, parseHeaderResult.Err)
		wsConnection.Close()
		return
	}

	if parseHeaderResult.IsOrganizer {
		c.connectOrganizer(r, wsConnection, parseHeaderResult.Token)
	} else {
		c.connectParticipant(r, wsConnection, parseHeaderResult.Token)
	}
}

func (c *Controller) readAuthorizationHeader(wsConnection *websocket.Conn) (string, error) {
	c.logger.Printf("awaiting authorization message from %s", wsConnection.RemoteAddr())
	err := wsConnection.SetReadDeadline(time.Now().Add(authorizationReadTimeout))
	if err != nil {
		return "", err
	}

	msg := &struct {
		Authorization string `json:"Authorization"`
	}{}
	return msg.Authorization, wsConnection.ReadJSON(msg)
}

func (c *Controller) connectOrganizer(r *http.Request, wsConnection *websocket.Conn, token string) {
	organizer, err := c.authenticator.AuthenticateOrganizer(token)
	if err != nil {
		c.logger.Printf("could not authenticate organizer %s: %s\n", r.RemoteAddr, err)
		wsConnection.Close()
		return
	}

	err = c.chatsManager.AddOrganizerConnection(organizer, wsConnection)
	if err != nil {
		c.logger.Printf("could not set up organizer connection %s: %s\n", r.RemoteAddr, err)
		wsConnection.Close()
		return
	}
}

func (c *Controller) connectParticipant(r *http.Request, wsConnection *websocket.Conn, token string) {
	participant, err := c.authenticator.AuthenticateParticipant(token)
	if err != nil {
		c.logger.Printf("could not authenticate participant %s: %s\n", r.RemoteAddr, err)
		wsConnection.Close()
		return
	}

	err = c.chatsManager.AddParticipantConnection(participant, wsConnection)
	if err != nil {
		c.logger.Printf("could not set up participant connection %s: %s\n", r.RemoteAddr, err)
		wsConnection.Close()
		return
	}
}
