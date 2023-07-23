package infrastructure

import (
	amqp "github.com/rabbitmq/amqp091-go"
	"log"
	"participant-api/internal/config"
	"participant-api/internal/modules/infrastructure/chat_requests"
	"participant-api/internal/modules/infrastructure/events"
	"participant-api/internal/modules/infrastructure/users"
	"time"
)

const maxDbQueryTime = 3 * time.Second
const maxMqPublishTime = 6 * time.Second
const maxRequestTime = 6 * time.Second

type Module struct {
	EventsRepository       *events.Repository
	UsersRepository        *users.Repository
	ChatRequestsRepository *chat_requests.Repository
	MqConnection           *amqp.Connection
	MqChannel              *amqp.Channel
}

func NewModule(cfg *config.Config, logger *log.Logger) *Module {
	participantDb := setupDbConnection(cfg.DatabaseDsn, logger)
	if cfg.RunDbMigration {
		err := runDbMigration(participantDb)
		if err != nil {
			logger.Fatalf("db migration failed: %s", err)
		}
	}

	mqConnection, mqChannel := setupMqConnection(cfg.QueueDsn, logger)

	return &Module{
		EventsRepository: events.NewRepository(cfg.OrganizerApiUrl, cfg.OrganizerApiKey, maxRequestTime),
		UsersRepository:  users.NewRepository(participantDb, maxDbQueryTime),
		ChatRequestsRepository: chat_requests.NewRepository(
			mqChannel, participantDb, maxMqPublishTime, maxDbQueryTime,
		),
		MqConnection: mqConnection,
		MqChannel:    mqChannel,
	}
}
