package config

import (
	"encoding/base64"
	"github.com/joho/godotenv"
	"log"
	"os"
	"strconv"
)

type Config struct {
	Port                 int
	Env                  string
	QueueDSN             string
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

	cfg.InParticipantApiUser = os.Getenv("IN_PARTICIPANT_API_USER")
	if cfg.InParticipantApiUser == "" {
		logger.Fatal("Error loading IN_PARTICIPANT_API_USER from .env file")
	}

	inParticipantApiPassBytes, err := base64.StdEncoding.DecodeString(os.Getenv("IN_PARTICIPANT_API_PASS"))
	if err != nil || len(inParticipantApiPassBytes) == 0 {
		logger.Fatal("Error loading IN_PARTICIPANT_API_PASS from .env file")
	}
	cfg.InParticipantApiPass = string(inParticipantApiPassBytes)

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
