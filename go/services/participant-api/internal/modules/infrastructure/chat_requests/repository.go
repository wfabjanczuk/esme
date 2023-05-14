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

const duplicateChatRequestLockMessage = "duplicate key value violates unique constraint"

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

func (r *Repository) DoesChatRequestLockExist(userId, eventId int) (bool, error) {
	ctx, cancel := context.WithTimeout(context.Background(), r.maxDbQueryTime)
	defer cancel()

	chatRequestDb := &ChatRequestLock{}

	query := `select cr."userId", cr."eventId" from "chatRequestLock" cr where cr."userId" = $1 and cr."eventId" = $2`

	err := r.db.QueryRowContext(ctx, query, userId, eventId).Scan(&chatRequestDb.UserId, &chatRequestDb.EventId)

	if err == sql.ErrNoRows {
		return false, nil
	}
	if err != nil {
		return false, err
	}
	return true, nil
}

func (r *Repository) CreateChatRequest(chatRequest *ChatRequest) error {
	err := r.insertChatRequestLock(chatRequest.ParticipantId, chatRequest.EventId)
	if err != nil {
		if strings.Contains(err.Error(), duplicateChatRequestLockMessage) {
			return api_errors.ErrChatRequestExists
		}
		return err
	}

	err = r.publishChatRequest(chatRequest)
	if err != nil {
		return r.DeleteChatRequestLock(chatRequest.ParticipantId, chatRequest.EventId)
	}

	return nil
}

func (r *Repository) DeleteChatRequestLock(userId, eventId int) error {
	dbErr := r.deleteChatRequestLock(userId, eventId)
	if dbErr != nil {
		return fmt.Errorf(
			"unable to delete chat request lock for user %d and event %d: %w",
			userId, eventId, dbErr,
		)
	}

	return nil
}

func (r *Repository) insertChatRequestLock(userId, eventId int) error {
	ctx, cancel := context.WithTimeout(context.Background(), r.maxDbQueryTime)
	defer cancel()

	stmt := `insert into "chatRequestLock" ("userId", "eventId") values ($1, $2)`
	_, err := r.db.ExecContext(ctx, stmt, userId, eventId)
	return err
}

func (r *Repository) deleteChatRequestLock(userId int, eventId int) error {
	ctx, cancel := context.WithTimeout(context.Background(), r.maxDbQueryTime)
	defer cancel()

	stmt := `delete from "chatRequestLock" where "userId" = $1 and "eventId" = $2`
	_, err := r.db.ExecContext(ctx, stmt, userId, eventId)
	return err
}

func (r *Repository) publishChatRequest(chat *ChatRequest) error {
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
