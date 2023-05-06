package chat_requests

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	amqp "github.com/rabbitmq/amqp091-go"
	"net/http"
	"time"
)

func getQueueName(agencyId int32) string {
	return fmt.Sprintf("chats_agency_%d", agencyId)
}

type Repository struct {
	mq                *amqp.Channel
	participantApiUrl string
	participantApiKey string
	maxRequestTime    time.Duration
}

func NewRepository(
	mq *amqp.Channel, participantApiUrl, participantApiKey string, maxRequestTime time.Duration,
) *Repository {
	return &Repository{
		mq:                mq,
		participantApiUrl: participantApiUrl,
		participantApiKey: participantApiKey,
		maxRequestTime:    maxRequestTime,
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

type deleteChatRequestPayload struct {
	ParticipantId int32 `json:"participantId"`
	EventId       int32 `json:"eventId"`
}

func (r *Repository) DeleteChatRequest(participantId, eventId int32) error {
	ctx, cancel := context.WithTimeout(context.Background(), r.maxRequestTime)
	defer cancel()

	payload, err := json.Marshal(
		deleteChatRequestPayload{
			ParticipantId: participantId,
			EventId:       eventId,
		},
	)
	if err != nil {
		return fmt.Errorf("could not marshal delete chat request: %w\n", err)
	}

	url := fmt.Sprintf("%s/chat-requests", r.participantApiUrl)
	request, err := http.NewRequestWithContext(ctx, http.MethodDelete, url, bytes.NewBuffer(payload))
	if err != nil {
		return fmt.Errorf("could not prepare delete chat request: %w\n", err)
	}
	request.Header = map[string][]string{
		"Authorization": {"Bearer " + r.participantApiKey},
		"Content-Type":  {"application/json"},
	}

	response, err := http.DefaultClient.Do(request)
	if err != nil {
		return fmt.Errorf("could not send delete chat request: %w", err)
	}
	defer response.Body.Close()

	if response.StatusCode != http.StatusOK {
		return fmt.Errorf("delete chat request response returned with status %d", response.StatusCode)
	}

	return nil
}
