package vault

import (
	"encoding/json"
	"os"
)

type Hosts struct {
	ChatRequestsQueue string `json:"chat_requests_queue"`
	MessengerApi      string `json:"messenger_api"`
	MessengerDb       string `json:"messenger_db"`
	OrganizerApi      string `json:"organizer_api"`
	OrganizerDb       string `json:"organizer_db"`
	ParticipantApi    string `json:"participant_api"`
	ParticipantDb     string `json:"participant_db"`
}

func readHosts(filename string) (Hosts, error) {
	hosts := Hosts{}
	file, err := os.Open(filename)
	if err != nil {
		return hosts, err
	}

	return hosts, json.NewDecoder(file).Decode(&hosts)
}
