package infrastructure

import (
	amqp "github.com/rabbitmq/amqp091-go"
	"log"
	"messenger/internal/config"
	"messenger/internal/modules/infrastructure/chats"
	"messenger/internal/modules/infrastructure/messages"
	"time"
)

const maxQueryTime = 3 * time.Second

type Module struct {
	ChatsRepository    *chats.ChatsRepository
	MessagesRepository *messages.MessagesRepository
	QueueConnection    *amqp.Connection
	QueueChannel       *amqp.Channel
}

func NewModule(cfg *config.Config, logger *log.Logger) *Module {
	db := setupDbConnection(cfg.DatabaseDsn, logger).Database("esme")
	qConnection, qChannel := setupQueueConnection(cfg.QueueDsn, logger)

	return &Module{
		ChatsRepository:    chats.NewChatsRepository(db, maxQueryTime),
		MessagesRepository: messages.NewMessagesRepository(db, maxQueryTime),
		QueueConnection:    qConnection,
		QueueChannel:       qChannel,
	}
}
