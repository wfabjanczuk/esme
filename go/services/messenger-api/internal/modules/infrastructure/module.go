package infrastructure

import (
	amqp "github.com/rabbitmq/amqp091-go"
	"log"
	"messenger-api/internal/config"
	"messenger-api/internal/modules/infrastructure/chat_requests"
	"messenger-api/internal/modules/infrastructure/chats"
	"messenger-api/internal/modules/infrastructure/enriched_chats"
	"messenger-api/internal/modules/infrastructure/messages"
	"messenger-api/internal/modules/infrastructure/participants"
	"time"
)

const maxDbQueryTime = 3 * time.Second
const maxRequestTime = 6 * time.Second

type Module struct {
	ChatRequestsRepository *chat_requests.Repository
	ChatsRepository        *chats.Repository
	MessagesRepository     *messages.Repository
	ParticipantsRepository *participants.Repository
	EnrichedChatsService   *enriched_chats.Service
	MqConnection           *amqp.Connection
	MqChannel              *amqp.Channel
}

func NewModule(cfg *config.Config, logger *log.Logger) *Module {
	db := setupDbConnection(cfg.DatabaseDsn, logger).Database("esme")
	mqConnection, mqChannel := setupQueueConnection(cfg.QueueDsn, logger)
	participantsRepository := participants.NewRepository(
		cfg.ParticipantApiUrl, cfg.ParticipantApiKey, maxRequestTime,
	)

	return &Module{
		ChatRequestsRepository: chat_requests.NewRepository(
			mqChannel, cfg.ParticipantApiUrl, cfg.ParticipantApiKey, maxRequestTime,
		),
		ChatsRepository:        chats.NewRepository(db, maxDbQueryTime),
		MessagesRepository:     messages.NewRepository(db, maxDbQueryTime),
		ParticipantsRepository: participantsRepository,
		EnrichedChatsService:   enriched_chats.NewService(participantsRepository, logger),
		MqConnection:           mqConnection,
		MqChannel:              mqChannel,
	}
}
