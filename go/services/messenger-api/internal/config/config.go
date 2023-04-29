package config

import (
	"github.com/joho/godotenv"
	"log"
	"os"
	"strconv"
)

type Config struct {
	Port              int
	Env               string
	QueueDsn          string
	DatabaseDsn       string
	OrganizerApiUrl   string
	ParticipantApiUrl string
	ParticipantApiKey string
}

func GetConfigFromEnv(logger *log.Logger) *Config {
	cfg := &Config{}

	err := godotenv.Load(".env.dev")
	if err != nil {
		logger.Fatal("Error loading .env file")
	}

	cfg.QueueDsn = os.Getenv("QUEUE_DSN")
	if cfg.QueueDsn == "" {
		logger.Fatal("Error loading QUEUE_DSN from .env file")
	}

	cfg.DatabaseDsn = os.Getenv("DATABASE_DSN")
	if cfg.DatabaseDsn == "" {
		logger.Fatal("Error loading DATABASE_DSN from .env file")
	}

	cfg.OrganizerApiUrl = os.Getenv("ORGANIZER_API_URL")
	if cfg.OrganizerApiUrl == "" {
		logger.Fatal("Error loading ORGANIZER_API_URL from .env file")
	}

	cfg.ParticipantApiUrl = os.Getenv("PARTICIPANT_API_URL")
	if cfg.ParticipantApiUrl == "" {
		logger.Fatal("Error loading PARTICIPANT_API_URL from .env file")
	}

	cfg.ParticipantApiKey = os.Getenv("PARTICIPANT_API_KEY")
	if cfg.ParticipantApiKey == "" {
		logger.Fatal("Error loading PARTICIPANT_API_KEY from .env file")
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
