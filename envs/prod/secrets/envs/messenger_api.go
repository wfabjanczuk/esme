package envs

import "secrets/vault"

func generateMessengerApiEnv(vault vault.Vault) {
	vars := map[string]string{
		"QUEUE_DSN":           vault.Queue.GetDsn(),
		"DATABASE_DSN":        vault.MessengerDb.GetDsn(),
		"ORGANIZER_API_URL":   vault.OrganizerApi.GetUrl(),
		"PARTICIPANT_API_URL": vault.ParticipantApi.GetUrl(),
		"PARTICIPANT_API_KEY": vault.ParticipantApi.ApiKey,
	}

	saveEnv(vars, serversEnvDir+"/messenger-api/.env")
}
