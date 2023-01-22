package config

import (
	"github.com/joho/godotenv"
	"log"
	"os"
	"strconv"
)

type Config struct {
	Port                 int
	Env                  string
	QueueDSN             string
	DatabaseDSN          string
	InParticipantApiUser string
	InParticipantApiPass string
}

func GetConfigFromEnv(logger *log.Logger) *Config {
	cfg := &Config{}

	err := godotenv.Load(".env.dev")
	if err != nil {
		logger.Fatal("Error loading .env file")
	}

	cfg.QueueDSN = os.Getenv("QUEUE_DSN")
	if cfg.QueueDSN == "" {
		logger.Fatal("Error loading QUEUE_DSN from .env file")
	}

	cfg.DatabaseDSN = os.Getenv("DATABASE_DSN")
	if cfg.DatabaseDSN == "" {
		logger.Fatal("Error loading DATABASE_DSN from .env file")
	}

	cfg.Port, _ = strconv.Atoi(os.Getenv("PORT"))
	if cfg.Port == 0 {
		cfg.Port = 8080
	}

	cfg.Env = os.Getenv("ENV")
	if cfg.Env == "" {
		cfg.Env = "development"
	}

	return cfg
}
