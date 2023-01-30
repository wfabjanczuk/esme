package input

import (
	"log"
	"messenger/internal/config"
	"messenger/internal/modules/api/input/organizers"
	"messenger/internal/modules/api/input/participants"
	"messenger/internal/modules/api/output"
	"messenger/internal/modules/api/users"
	"messenger/internal/modules/infrastructure/chats"
)

type Manager struct {
	authenticator        *users.Authenticator
	chatsRepository      *chats.ChatsRepository
	outputManager        *output.Manager
	organizersListener   *organizers.Listener
	participantsListener *participants.Listener
	logger               *log.Logger
}

func NewManager(cfg *config.Config, chatsRepository *chats.ChatsRepository, outputManager *output.Manager, logger *log.Logger) *Manager {
	return &Manager{
		authenticator:        users.NewAuthenticator(cfg, logger),
		chatsRepository:      chatsRepository,
		outputManager:        outputManager,
		organizersListener:   organizers.NewListener(outputManager, logger),
		participantsListener: participants.NewListener(outputManager, logger),
		logger:               logger,
	}
}
