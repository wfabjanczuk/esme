package envs

import "secrets/vault"

func generateParticipantApiEnv(vault vault.Vault) {
	vars := map[string]string{
		"QUEUE_DSN":           vault.Queue.GetDsn(),
		"DATABASE_DSN":        vault.ParticipantDb.GetDsn(),
		"JWT_SECRET":          vault.ParticipantApi.JwtSecret,
		"PARTICIPANT_API_KEY": vault.ParticipantApi.ApiKey,
		"ORGANIZER_API_URL":   vault.OrganizerApi.GetUrl(),
		"ORGANIZER_API_KEY":   vault.OrganizerApi.ApiKey,
	}

	saveEnv(vars, "../servers/participant-api/.env")
}
