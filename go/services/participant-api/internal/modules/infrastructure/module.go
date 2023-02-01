package infrastructure

import (
	amqp "github.com/rabbitmq/amqp091-go"
	"log"
	"participant-api/internal/config"
	"participant-api/internal/modules/infrastructure/events"
	"participant-api/internal/modules/infrastructure/users"
	"time"
)

const maxQueryTime = 3 * time.Second

type Module struct {
	EventsRepository *events.Repository
	UsersRepository  *users.Repository
	QueueConnection  *amqp.Connection
	QueueChannel     *amqp.Channel
}

func NewModule(cfg *config.Config, logger *log.Logger) *Module {
	organizerDb := setupDbConnection(cfg.OrganizerDbDsn, logger)
	participantDb := setupDbConnection(cfg.ParticipantDbDsn, logger)
	qConnection, qChannel := setupQueueConnection(cfg.QueueDsn, logger)

	return &Module{
		EventsRepository: events.NewRepository(organizerDb, maxQueryTime),
		UsersRepository:  users.NewRepository(participantDb, maxQueryTime),
		QueueConnection:  qConnection,
		QueueChannel:     qChannel,
	}
}
