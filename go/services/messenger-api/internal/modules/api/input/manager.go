package input

import (
	"log"
	"messenger-api/internal/config"
	"messenger-api/internal/modules/api/input/organizers"
	"messenger-api/internal/modules/api/input/participants"
	"messenger-api/internal/modules/api/output"
	"messenger-api/internal/modules/api/users"
	"messenger-api/internal/modules/infrastructure/chats"
)

type Manager struct {
	authenticator        *users.Authenticator
	chatsRepository      *chats.Repository
	outputManager        *output.Manager
	organizersListener   *organizers.Listener
	participantsListener *participants.Listener
	logger               *log.Logger
}

func NewManager(
	cfg *config.Config, chatsRepository *chats.Repository, outputManager *output.Manager, logger *log.Logger,
) *Manager {
	return &Manager{
		authenticator:        users.NewAuthenticator(cfg, logger),
		chatsRepository:      chatsRepository,
		outputManager:        outputManager,
		organizersListener:   organizers.NewListener(outputManager, logger),
		participantsListener: participants.NewListener(outputManager, logger),
		logger:               logger,
	}
}
