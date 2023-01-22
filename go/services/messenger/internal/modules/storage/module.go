package storage

import (
	"context"
	"fmt"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
	"log"
	"messenger/internal/config"
	"messenger/internal/modules/storage/chats"
	"messenger/internal/modules/storage/messages"
	"time"
)

const maxQueryTime = 3 * time.Second

type Module struct {
	ChatsRepository    *chats.ChatsRepository
	MessagesRepository *messages.MessagesRepository
}

func NewModule(config *config.Config, logger *log.Logger) *Module {
	db := setupConnection(config.DatabaseDsn, logger).Database("esme")

	return &Module{
		ChatsRepository:    chats.NewChatsRepository(db, maxQueryTime),
		MessagesRepository: messages.NewMessagesRepository(db, maxQueryTime),
	}
}

func setupConnection(dsn string, logger *log.Logger) *mongo.Client {
	var err error
	maxDevRetries := 10
	retryInterval := 10 * time.Second

	logger.Println(fmt.Sprintf("Trying to open dev db connection. Max retries: %d", maxDevRetries))

	for i := 1; i <= maxDevRetries; i++ {
		logger.Println(fmt.Sprintf("Opening dev db connection attempt %d", i))

		client, err := openConnection(dsn)
		if err == nil {
			logger.Println("Dev db connection successfully opened.")
			return client
		}

		logger.Println(err)
		time.Sleep(retryInterval)
	}

	logger.Fatal("Could not open dev db connection: ", err)
	return nil
}

func openConnection(dsn string) (*mongo.Client, error) {
	client, err := mongo.NewClient(options.Client().ApplyURI(dsn))
	if err != nil {
		return nil, err
	}
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	err = client.Connect(ctx)
	if err != nil {
		return nil, err
	}

	err = client.Ping(ctx, readpref.Primary())
	if err != nil {
		return nil, err
	}

	return client, nil
}
