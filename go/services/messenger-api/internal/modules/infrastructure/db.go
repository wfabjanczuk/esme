package infrastructure

import (
	"context"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
	"log"
	"time"
)

func setupDbConnection(dsn string, logger *log.Logger) *mongo.Client {
	var err error
	maxDevRetries := 10
	retryInterval := 10 * time.Second

	logger.Printf("trying to open dev db connection (max retries: %d)\n", maxDevRetries)

	for i := 1; i <= maxDevRetries; i++ {
		logger.Printf("opening dev db connection attempt %d\n", i)

		client, err := openDbConnection(dsn)
		if err == nil {
			logger.Println("dev db connection successfully opened")
			return client
		}

		logger.Println(err)
		time.Sleep(retryInterval)
	}

	logger.Panicf("could not open dev db connection: %s\n", err)
	return nil
}

func openDbConnection(dsn string) (*mongo.Client, error) {
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
