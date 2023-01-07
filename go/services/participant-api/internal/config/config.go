package config

import (
	"github.com/joho/godotenv"
	"log"
	"os"
	"strconv"
)

type Config struct {
	Port           int
	Env            string
	ParticipantDSN string
	JwtSecret      string
}

func GetConfigFromEnv(logger *log.Logger) *Config {
	cfg := &Config{}

	err := godotenv.Load(".env.dev")
	if err != nil {
		logger.Fatal("Error loading environmental files")
	}

	cfg.ParticipantDSN = os.Getenv("PARTICIPANT_DSN")
	if cfg.ParticipantDSN == "" {
		logger.Fatal("Error loading DSN from .env file")
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
