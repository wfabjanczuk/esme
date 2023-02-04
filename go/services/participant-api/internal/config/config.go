package config

import (
	"github.com/joho/godotenv"
	"log"
	"os"
	"strconv"
)

type Config struct {
	Port             int
	Env              string
	QueueDsn         string
	OrganizerDbDsn   string
	ParticipantDbDsn string
	JwtSecret        string
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

	cfg.OrganizerDbDsn = os.Getenv("ORGANIZER_DB_DSN")
	if cfg.OrganizerDbDsn == "" {
		logger.Fatal("Error loading ORGANIZER_DB_DSN from .env file")
	}

	cfg.ParticipantDbDsn = os.Getenv("PARTICIPANT_DB_DSN")
	if cfg.ParticipantDbDsn == "" {
		logger.Fatal("Error loading PARTICIPANT_DB_DSN from .env file")
	}

	cfg.Port, _ = strconv.Atoi(os.Getenv("PORT"))
	if cfg.Port == 0 {
		cfg.Port = 8080
	}

	cfg.Env = os.Getenv("ENV")
	if cfg.Env == "" {
		cfg.Env = "development"
	}

	cfg.JwtSecret = os.Getenv("JWT_SECRET")
	if cfg.JwtSecret == "" {
		logger.Fatal("Error loading JWT_SECRET from .env file")
	}

	return cfg
}
