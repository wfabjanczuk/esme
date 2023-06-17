package infrastructure

import (
	"database/sql"
	"log"
	"time"

	_ "github.com/jackc/pgconn"
	_ "github.com/jackc/pgx/v4"
	_ "github.com/jackc/pgx/v4/stdlib"
)

const maxOpenDbConn = 10
const maxIdleDbConn = 5
const maxDbLifetime = 5 * time.Minute

func setupDbConnection(dsn string, logger *log.Logger) *sql.DB {
	var db *sql.DB
	var err error
	maxRetries := 10
	retryInterval := 10 * time.Second

	logger.Printf("trying to open db connection (max retries: %d)\n", maxRetries)

	for i := 1; i <= maxRetries; i++ {
		logger.Printf("opening db connection attempt %d\n", i)

		db, err = openDbConnection(dsn)
		if err == nil {
			logger.Println("db connection successfully opened")
			return db
		}

		logger.Println(err)
		time.Sleep(retryInterval)
	}

	logger.Panicf("could not open db connection: %s\n", err)
	return db
}

func openDbConnection(dsn string) (*sql.DB, error) {
	db, err := sql.Open("pgx", dsn)
	if err != nil {
		return nil, err
	}

	db.SetMaxOpenConns(maxOpenDbConn)
	db.SetMaxIdleConns(maxIdleDbConn)
	db.SetConnMaxLifetime(maxDbLifetime)

	if err = db.Ping(); err != nil {
		return nil, err
	}
	return db, nil
}
