package chat_requests

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	amqp "github.com/rabbitmq/amqp091-go"
	"participant-api/internal/modules/api/common/api_errors"
	"strings"
	"time"
)

const duplicateChatRequestMessage = "duplicate key value violates unique constraint"

func getQueueName(agencyId int) string {
	return fmt.Sprintf("chats_agency_%d", agencyId)
}

type Repository struct {
	mq               *amqp.Channel
	db               *sql.DB
	maxMqPublishTime time.Duration
	maxDbQueryTime   time.Duration
}

func NewRepository(
	mq *amqp.Channel, participantDb *sql.DB, maxMqPublishTime, maxDbQueryTime time.Duration,
) *Repository {
	return &Repository{
		mq:               mq,
		db:               participantDb,
		maxMqPublishTime: maxMqPublishTime,
		maxDbQueryTime:   maxDbQueryTime,
	}
}

func (r *Repository) DoesChatRequestExist(userId, eventId int) (bool, error) {
	ctx, cancel := context.WithTimeout(context.Background(), r.maxDbQueryTime)
	defer cancel()

	chatRequestDb := &ChatRequestDb{}

	query := `select cr."userId", cr."eventId" from "chatRequest" cr where cr."userId" = $1 and cr."eventId" = $2`

	err := r.db.QueryRowContext(ctx, query, userId, eventId).Scan(&chatRequestDb.UserId, &chatRequestDb.EventId)

	if err == sql.ErrNoRows {
		return false, nil
	}
	if err != nil {
		return false, err
	}
	return true, nil
}

func (r *Repository) RequestChat(chatRequest *ChatRequestMq) error {
	err := r.insertChatRequest(chatRequest.ParticipantId, chatRequest.EventId)
	if err != nil {
		if strings.Contains(err.Error(), duplicateChatRequestMessage) {
			return api_errors.ErrChatRequestExists
		}
		return err
	}

	err = r.publishChatSetup(chatRequest)
	if err != nil {
		dbErr := r.deleteChatRequest(chatRequest.ParticipantId, chatRequest.EventId)
		if dbErr != nil {
			err = fmt.Errorf("%w; unable to delete chat request from participant db: %s", err, dbErr)
		}
		return err
	}

	return nil
}

func (r *Repository) insertChatRequest(userId, eventId int) error {
	ctx, cancel := context.WithTimeout(context.Background(), r.maxDbQueryTime)
	defer cancel()

	stmt := `insert into "chatRequest" ("userId", "eventId") values ($1, $2)`
	_, err := r.db.ExecContext(ctx, stmt, userId, eventId)
	return err
}

func (r *Repository) deleteChatRequest(userId int, eventId int) error {
	ctx, cancel := context.WithTimeout(context.Background(), r.maxDbQueryTime)
	defer cancel()

	stmt := `delete from "chatRequest" where "userId" = $1 and "eventId" = $2`
	_, err := r.db.ExecContext(ctx, stmt, userId, eventId)
	return err
}

func (r *Repository) publishChatSetup(chat *ChatRequestMq) error {
	queue, err := r.mq.QueueDeclare(
		getQueueName(chat.AgencyId),
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		return err
	}

	message, err := json.Marshal(chat)
	if err != nil {
		return err
	}

	ctx, cancel := context.WithTimeout(context.Background(), r.maxMqPublishTime)
	defer cancel()

	err = r.mq.PublishWithContext(
		ctx, "", queue.Name, false, false, amqp.Publishing{
			ContentType: "application/json",
			Body:        message,
		},
	)
	return err
}
