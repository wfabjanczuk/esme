package input

import (
	"log"
	"messenger/internal/config"
	"messenger/internal/modules/api/output"
	"messenger/internal/modules/api/users"
	"messenger/internal/modules/storage/chats"
)

type Manager struct {
	authenticator   *users.Authenticator
	chatsRepository *chats.ChatsRepository
	outputManager   *output.Manager
	logger          *log.Logger
}

func NewManager(config *config.Config, chatsRepository *chats.ChatsRepository, outputManager *output.Manager, logger *log.Logger) *Manager {
	return &Manager{
		authenticator:   users.NewAuthenticator(config, logger),
		chatsRepository: chatsRepository,
		outputManager:   outputManager,
		logger:          logger,
	}
}
