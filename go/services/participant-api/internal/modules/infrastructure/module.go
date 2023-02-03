package infrastructure

import (
	amqp "github.com/rabbitmq/amqp091-go"
	"log"
	"participant-api/internal/config"
	"participant-api/internal/modules/infrastructure/chats"
	"participant-api/internal/modules/infrastructure/events"
	"participant-api/internal/modules/infrastructure/subscriptions"
	"participant-api/internal/modules/infrastructure/users"
	"time"
)

const maxDbQueryTime = 3 * time.Second
const maxMqPublishTime = 6 * time.Second

type Module struct {
	EventsRepository        *events.Repository
	UsersRepository         *users.Repository
	SubscriptionsRepository *subscriptions.Repository
	ChatsRepository         *chats.Repository
	MqConnection            *amqp.Connection
	MqChannel               *amqp.Channel
}

func NewModule(cfg *config.Config, logger *log.Logger) *Module {
	organizerDb := setupDbConnection(cfg.OrganizerDbDsn, logger)
	participantDb := setupDbConnection(cfg.ParticipantDbDsn, logger)
	mqConnection, mqChannel := setupMqConnection(cfg.QueueDsn, logger)

	return &Module{
		EventsRepository:        events.NewRepository(organizerDb, maxDbQueryTime),
		UsersRepository:         users.NewRepository(participantDb, maxDbQueryTime),
		SubscriptionsRepository: subscriptions.NewRepository(participantDb, maxDbQueryTime),
		ChatsRepository:         chats.NewRepository(mqChannel, participantDb, maxMqPublishTime, maxDbQueryTime),
		MqConnection:            mqConnection,
		MqChannel:               mqChannel,
	}
}
