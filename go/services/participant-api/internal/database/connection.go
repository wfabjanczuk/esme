package database

import (
	"database/sql"
	"fmt"
	"log"
	"time"

	_ "github.com/jackc/pgconn"
	_ "github.com/jackc/pgx/v4"
	_ "github.com/jackc/pgx/v4/stdlib"
)

const maxOpenDbConn = 10
const maxIdleDbConn = 5
const maxDbLifetime = 5 * time.Minute

func SetupConnection(DSN string, logger *log.Logger) *sql.DB {
	var db *sql.DB
	var err error
	maxDevRetries := 10
	retryInterval := 10 * time.Second

	logger.Println(fmt.Sprintf("Trying to open dev DB connection. Max retries: %d", maxDevRetries))

	for i := 1; i <= maxDevRetries; i++ {
		logger.Println(fmt.Sprintf("Opening dev DB connection attempt %d", i))

		db, err = openConnection(DSN)
		if err == nil {
			logger.Println("Dev DB connection successfully opened.")
			return db
		}

		logger.Println(err)
		time.Sleep(retryInterval)
	}

	logger.Fatal("Could not open dev DB connection: ", err)
	return db
}

func openConnection(DSN string) (*sql.DB, error) {
	db, err := sql.Open("pgx", DSN)
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
