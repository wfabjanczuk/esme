package infrastructure

import (
	amqp "github.com/rabbitmq/amqp091-go"
	"log"
	"time"
)

func setupQueueConnection(dsn string, logger *log.Logger) (*amqp.Connection, *amqp.Channel) {
	var connection *amqp.Connection
	var channel *amqp.Channel
	var err error
	maxDevRetries := 10
	retryInterval := 10 * time.Second

	logger.Printf("trying to open dev queue connection (max retries: %d)\n", maxDevRetries)

	for i := 1; i <= maxDevRetries; i++ {
		logger.Printf("opening dev queue connection attempt %d\n", i)

		connection, channel, err = openQueueConnection(dsn)
		if err == nil {
			logger.Println("dev queue connection successfully opened")
			return connection, channel
		}

		logger.Println(err)
		time.Sleep(retryInterval)
	}

	logger.Panicf("could not open dev queue connection: %s\n", err)
	return connection, channel
}

func openQueueConnection(dsn string) (*amqp.Connection, *amqp.Channel, error) {
	connection, err := amqp.Dial(dsn)
	if err != nil {
		return nil, nil, err
	}

	channel, err := connection.Channel()
	if err != nil {
		return nil, nil, err
	}

	return connection, channel, nil
}
