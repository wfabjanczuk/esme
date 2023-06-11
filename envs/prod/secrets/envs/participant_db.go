package envs

import (
	"secrets/vault"
)

func generateParticipantDbEnv(vault vault.Vault) {
	vars := map[string]string{
		"PARTICIPANT_DB_USER":     vault.ParticipantDb.User,
		"PARTICIPANT_DB_PASSWORD": vault.ParticipantDb.Password,
	}

	saveEnv(vars, serversEnvDir+"/participant-db/.env")
}
