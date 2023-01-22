package input

import (
	"log"
	"messenger/internal/modules/api/output"
	"messenger/internal/modules/storage/chats"
)

type Manager struct {
	chatsRepository *chats.ChatsRepository
	outputManager   *output.Manager
	logger          *log.Logger
}

func NewManager(chatsRepository *chats.ChatsRepository, outputManager *output.Manager, logger *log.Logger) *Manager {
	return &Manager{
		chatsRepository: chatsRepository,
		outputManager:   outputManager,
		logger:          logger,
	}
}
