package envs

import (
	"fmt"
	"log"
	"os"
	"secrets/vault"
)

func GenerateEnvs(vault vault.Vault) {
	generateChatRequestsQueueEnv(vault)

	generateMessengerApiEnv(vault)
	generateMessengerDbEnv(vault)

	generateOrganizerApiEnv(vault)
	generateOrganizerDbEnv(vault)

	generateParticipantApiEnv(vault)
	generateParticipantDbEnv(vault)
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
			log.Panicf("could not write %s to %s: %w", key, filename, err)
		}
	}
}
