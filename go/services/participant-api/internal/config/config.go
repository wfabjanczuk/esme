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
	JWTSecret      string
}

func GetConfigFromEnv(logger *log.Logger) *Config {
	cfg := &Config{}

	err := godotenv.Load(".env.dev")
	if err != nil {
		logger.Fatal("Error loading .env file")
	}

	cfg.ParticipantDSN = os.Getenv("PARTICIPANT_DSN")
	if cfg.ParticipantDSN == "" {
		logger.Fatal("Error loading PARTICIPANT_DSN from .env file")
	}

	cfg.Port, _ = strconv.Atoi(os.Getenv("PORT"))
	if cfg.Port == 0 {
		cfg.Port = 8080
	}

	cfg.Env = os.Getenv("ENV")
	if cfg.Env == "" {
		cfg.Env = "development"
	}

	cfg.JWTSecret = os.Getenv("JWT_SECRET")
	if cfg.JWTSecret == "" {
		logger.Fatal("Error loading JWT_SECRET from .env file")
	}

	return cfg
}
