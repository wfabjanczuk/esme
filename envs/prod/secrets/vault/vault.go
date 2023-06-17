package vault

import (
	"encoding/json"
	"log"
	"os"
	"strings"
)

type Vault struct {
	Queue          Queue          `json:"chat_requests_queue"`
	MessengerApi   MessengerApi   `json:"messenger_api"`
	MessengerDb    MessengerDb    `json:"messenger_db"`
	OrganizerApi   OrganizerApi   `json:"organizer_api"`
	OrganizerDb    OrganizerDb    `json:"organizer_db"`
	ParticipantApi ParticipantApi `json:"participant_api"`
	ParticipantDb  ParticipantDb  `json:"participant_db"`
}

func NewVault(vaultFilename string, hostsFilename string) Vault {
	hosts, err := readHosts(hostsFilename)
	if err != nil {
		log.Panicf("addresses of hosts could not be read from %s: %s", hostsFilename, err)
	}

	v := Vault{}

	v.Queue.Host = hosts.ChatRequestsQueue
	v.Queue.Port = 8201
	v.Queue.User = generateString(32, false)
	v.Queue.Password = generateString(32, true)

	v.MessengerApi.Host = hosts.MessengerApi
	v.MessengerApi.Port = 8300

	v.MessengerDb.Host = hosts.MessengerDb
	v.MessengerDb.Port = 8301
	v.MessengerDb.User = generateString(32, false)
	v.MessengerDb.Password = generateString(32, false)

	v.OrganizerApi.Host = hosts.OrganizerApi
	v.OrganizerApi.Port = 8000
	v.OrganizerApi.JwtSecret = generateString(64, true)
	v.OrganizerApi.ApiKey = generateString(32, true)
	v.OrganizerApi.SuperAdminEmail = strings.ToLower(generateString(32, false)) + "@esme.com"
	v.OrganizerApi.SuperAdminPassword = generateString(32, true)

	v.OrganizerDb.Host = hosts.OrganizerDb
	v.OrganizerDb.Port = 8001
	v.OrganizerDb.DbName = "esme"
	v.OrganizerDb.User = generateString(32, false)
	v.OrganizerDb.Password = generateString(32, true)

	v.ParticipantApi.Host = hosts.ParticipantApi
	v.ParticipantApi.Port = 8100
	v.ParticipantApi.JwtSecret = generateString(64, true)
	v.ParticipantApi.ApiKey = generateString(32, true)

	v.ParticipantDb.Host = hosts.ParticipantDb
	v.ParticipantDb.Port = 8101
	v.ParticipantDb.DbName = "esme"
	v.ParticipantDb.User = generateString(32, false)
	v.ParticipantDb.Password = generateString(32, true)

	err = v.saveVault(vaultFilename)
	if err != nil {
		log.Panicf("vault could not be saved to %s: %s", vaultFilename, err)
	}

	return v
}

func (v Vault) saveVault(filename string) error {
	vaultJson, err := json.MarshalIndent(v, "", "  ")
	if err != nil {
		return err
	}

	file, err := os.Create(filename)
	if err != nil {
		return err
	}
	defer file.Close()

	_, err = file.Write(vaultJson)
	if err != nil {
		return err
	}

	return nil
}
