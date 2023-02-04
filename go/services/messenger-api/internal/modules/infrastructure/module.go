package infrastructure

import (
	amqp "github.com/rabbitmq/amqp091-go"
	"log"
	"messenger-api/internal/config"
	"messenger-api/internal/modules/infrastructure/chat_requests"
	"messenger-api/internal/modules/infrastructure/chats"
	"messenger-api/internal/modules/infrastructure/messages"
	"time"
)

const maxDbQueryTime = 3 * time.Second

type Module struct {
	ChatRequestsRepository *chat_requests.Repository
	ChatsRepository        *chats.Repository
	MessagesRepository     *messages.Repository
	MqConnection           *amqp.Connection
	MqChannel              *amqp.Channel
}

func NewModule(cfg *config.Config, logger *log.Logger) *Module {
	db := setupDbConnection(cfg.DatabaseDsn, logger).Database("esme")
	mqConnection, mqChannel := setupQueueConnection(cfg.QueueDsn, logger)

	return &Module{
		ChatRequestsRepository: chat_requests.NewRepository(mqChannel),
		ChatsRepository:        chats.NewRepository(db, maxDbQueryTime),
		MessagesRepository:     messages.NewRepository(db, maxDbQueryTime),
		MqConnection:           mqConnection,
		MqChannel:              mqChannel,
	}
}
