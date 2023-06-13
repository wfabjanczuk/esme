package config

import (
	"encoding/json"
	"os"
)

type Config struct {
	EventId           int    `json:"event_id"`
	MessengerApiUrl   string `json:"messenger_api_url"`
	MessengerWsUrl    string `json:"messenger_ws_url"`
	OrganizerApiUrl   string `json:"organizer_api_url"`
	OrganizerEmail    string `json:"organizer_email"`
	OrganizerPassword string `json:"organizer_password"`
	ParticipantApiUrl string `json:"participant_api_url"`
}

func NewConfig(filename string) (Config, error) {
	config := Config{}
	file, err := os.Open(filename)
	if err != nil {
		return config, err
	}

	return config, json.NewDecoder(file).Decode(&config)
}
