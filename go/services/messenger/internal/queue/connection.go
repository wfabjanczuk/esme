package queue

import (
	"fmt"
	amqp "github.com/rabbitmq/amqp091-go"
	"log"
	"time"
)

func SetupConnection(dsn string, logger *log.Logger) (*amqp.Connection, *amqp.Channel) {
	var connection *amqp.Connection
	var channel *amqp.Channel
	var err error
	maxDevRetries := 10
	retryInterval := 10 * time.Second

	logger.Println(fmt.Sprintf("Trying to open dev queue connection. Max retries: %d", maxDevRetries))

	for i := 1; i <= maxDevRetries; i++ {
		logger.Println(fmt.Sprintf("Opening dev queue connection attempt %d", i))

		connection, channel, err = openConnection(dsn)
		if err == nil {
			logger.Println("Dev queue connection successfully opened.")
			return connection, channel
		}

		logger.Println(err)
		time.Sleep(retryInterval)
	}

	logger.Fatal("Could not open dev queue connection: ", err)
	return connection, channel
}

func openConnection(dsn string) (*amqp.Connection, *amqp.Channel, error) {
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
