package chat_requests

import (
	"encoding/json"
	"fmt"
	amqp "github.com/rabbitmq/amqp091-go"
)

func getQueueName(agencyId int32) string {
	return fmt.Sprintf("chats_agency_%d", agencyId)
}

type Repository struct {
	mq *amqp.Channel
}

func NewRepository(mq *amqp.Channel) *Repository {
	return &Repository{
		mq: mq,
	}
}

func (r *Repository) GetChatRequest(agencyId int32) (*ChatRequest, bool, error) {
	queue, err := r.mq.QueueDeclare(
		getQueueName(agencyId),
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		return nil, false, err
	}

	message, ok, err := r.mq.Get(queue.Name, true)
	if err != nil {
		return nil, false, err
	}
	if !ok {
		return nil, false, nil
	}

	chatRequest := &ChatRequest{}
	err = json.Unmarshal(message.Body, chatRequest)
	if err != nil {
		return nil, false, err
	}

	return chatRequest, true, nil
}
