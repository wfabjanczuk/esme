package infrastructure

import (
	amqp "github.com/rabbitmq/amqp091-go"
	"log"
	"messenger-api/internal/config"
	"messenger-api/internal/modules/infrastructure/chats"
	"messenger-api/internal/modules/infrastructure/messages"
	"time"
)

const maxQueryTime = 3 * time.Second

type Module struct {
	ChatsRepository    *chats.Repository
	MessagesRepository *messages.Repository
	QueueConnection    *amqp.Connection
	QueueChannel       *amqp.Channel
}

func NewModule(cfg *config.Config, logger *log.Logger) *Module {
	db := setupDbConnection(cfg.DatabaseDsn, logger).Database("esme")
	qConnection, qChannel := setupQueueConnection(cfg.QueueDsn, logger)

	return &Module{
		ChatsRepository:    chats.NewRepository(db, maxQueryTime),
		MessagesRepository: messages.NewRepository(db, maxQueryTime),
		QueueConnection:    qConnection,
		QueueChannel:       qChannel,
	}
}
