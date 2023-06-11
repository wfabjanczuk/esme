package envs

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"secrets/vault"
)

const serversEnvDir = "../servers"
const clientsEnvDir = "../clients"

func GenerateEnvs(vault vault.Vault) {
	generateChatRequestsQueueEnv(vault)

	generateMessengerApiEnv(vault)
	generateMessengerDbEnv(vault)

	generateOrganizerApiEnv(vault)
	generateOrganizerDbEnv(vault)
	generateOrganizerUiEnv(vault)

	generateParticipantApiEnv(vault)
	generateParticipantDbEnv(vault)
	generateParticipantUiEnv(vault)
}

func saveEnv(vars map[string]string, filename string) {
	file, err := os.Create(filename)
	if err != nil {
		log.Panicf("could not create %s: %s", filename, err)
	}
	defer file.Close()

	for key, value := range vars {
		line := fmt.Sprintf("%s=%s\n", key, value)
		_, err = file.WriteString(line)
		if err != nil {
			log.Panicf("could not write %s to %s: %s", key, filename, err)
		}
	}
}

func saveEnvJson(vars any, filename string) {
	file, err := os.Create(filename)
	if err != nil {
		log.Panicf("could not create %s: %s", filename, err)
	}
	defer file.Close()

	payload, err := json.MarshalIndent(vars, "", "  ")
	if err != nil {
		log.Panicf("could not marshal %s: %s", filename, err)
	}

	_, err = file.Write(payload)
	if err != nil {
		log.Panicf("could not write to %s: %s", filename, err)
	}
}
