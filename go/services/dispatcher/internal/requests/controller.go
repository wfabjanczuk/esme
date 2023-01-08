package requests

import (
	"context"
	"dispatcher/internal/response"
	"encoding/json"
	"github.com/julienschmidt/httprouter"
	amqp "github.com/rabbitmq/amqp091-go"
	"io"
	"log"
	"net/http"
	"time"
)

type Controller struct {
	queueConnection *amqp.Connection
	queueChannel    *amqp.Channel
	responder       *response.Responder
	logger          *log.Logger
}

func NewController(
	connection *amqp.Connection,
	channel *amqp.Channel,
	logger *log.Logger,
	router *httprouter.Router,
) *Controller {
	controller := &Controller{
		queueConnection: connection,
		queueChannel:    channel,
		responder:       response.NewResponder(logger),
		logger:          logger,
	}

	router.HandlerFunc(http.MethodPost, "/requests", controller.AddChatRequest)
	return controller
}

func (c *Controller) AddChatRequest(w http.ResponseWriter, r *http.Request) {
	body, err := io.ReadAll(r.Body)
	if err != nil {
		c.responder.WriteError(w, err, http.StatusBadRequest)
		return
	}

	addChatRequestDTO := &addChatRequestDTO{}
	err = json.Unmarshal(body, addChatRequestDTO)
	if err != nil {
		c.responder.WriteError(w, err, http.StatusBadRequest)
		return
	}
	message, err := json.Marshal(addChatRequestDTO)
	if err != nil {
		c.responder.WriteError(w, err, http.StatusBadRequest)
		return
	}

	queue, err := c.queueChannel.QueueDeclare(
		"requests",
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		c.responder.WriteError(w, err, http.StatusInternalServerError)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err = c.queueChannel.PublishWithContext(ctx,
		"",
		queue.Name,
		false,
		false,
		amqp.Publishing{
			ContentType: "application/json",
			Body:        message,
		},
	)
	c.logger.Printf(" [x] Sent %s\n", message)
}
