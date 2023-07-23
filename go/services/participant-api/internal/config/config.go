package config

import (
	"flag"
	"github.com/joho/godotenv"
	"log"
	"os"
)

type Config struct {
	RunDbMigration    bool
	QueueDsn          string
	DatabaseDsn       string
	ParticipantApiKey string
	OrganizerApiUrl   string
	OrganizerApiKey   string
	JwtSecret         string
}

func GetConfigFromEnv(logger *log.Logger) *Config {
	configPath := flag.String("config", ".env", "load specific config")
	flag.Parse()

	cfg := &Config{}

	err := godotenv.Load(*configPath)
	if err != nil {
		logger.Fatal("Error loading env file")
	}

	runDbMigration := os.Getenv("RUN_DB_MIGRATION")
	if runDbMigration == "true" {
		cfg.RunDbMigration = true
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

	cfg.OrganizerApiKey = os.Getenv("ORGANIZER_API_KEY")
	if cfg.OrganizerApiKey == "" {
		logger.Fatal("Error loading ORGANIZER_API_KEY from env file")
	}

	cfg.ParticipantApiKey = os.Getenv("PARTICIPANT_API_KEY")
	if cfg.ParticipantApiKey == "" {
		logger.Fatal("Error loading PARTICIPANT_API_KEY from env file")
	}

	cfg.JwtSecret = os.Getenv("JWT_SECRET")
	if cfg.JwtSecret == "" {
		logger.Fatal("Error loading JWT_SECRET from env file")
	}

	return cfg
}
