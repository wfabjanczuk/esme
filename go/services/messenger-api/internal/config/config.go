package config

import (
	"flag"
	"github.com/joho/godotenv"
	"log"
	"os"
)

type Config struct {
	QueueDsn          string
	DatabaseDsn       string
	OrganizerApiUrl   string
	ParticipantApiUrl string
	ParticipantApiKey string
}

func GetConfigFromEnv(logger *log.Logger) *Config {
	configPath := flag.String("config", ".env", "load specific config")
	flag.Parse()

	cfg := &Config{}

	err := godotenv.Load(*configPath)
	if err != nil {
		logger.Fatal("Error loading env file")
	}

	cfg.QueueDsn = os.Getenv("QUEUE_DSN")
	if cfg.QueueDsn == "" {
		logger.Fatal("Error loading QUEUE_DSN from env file")
	}

	cfg.DatabaseDsn = os.Getenv("DATABASE_DSN")
	if cfg.DatabaseDsn == "" {
		logger.Fatal("Error loading DATABASE_DSN from env file")
	}

	cfg.OrganizerApiUrl = os.Getenv("ORGANIZER_API_URL")
	if cfg.OrganizerApiUrl == "" {
		logger.Fatal("Error loading ORGANIZER_API_URL from env file")
	}

	cfg.ParticipantApiUrl = os.Getenv("PARTICIPANT_API_URL")
	if cfg.ParticipantApiUrl == "" {
		logger.Fatal("Error loading PARTICIPANT_API_URL from env file")
	}

	cfg.ParticipantApiKey = os.Getenv("PARTICIPANT_API_KEY")
	if cfg.ParticipantApiKey == "" {
		logger.Fatal("Error loading PARTICIPANT_API_KEY from env file")
	}

	return cfg
}
