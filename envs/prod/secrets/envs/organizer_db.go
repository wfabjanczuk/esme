package envs

import "secrets/vault"

func generateOrganizerDbEnv(vault vault.Vault) {
	vars := map[string]string{
		"ORGANIZER_DB_USER":     vault.OrganizerDb.User,
		"ORGANIZER_DB_PASSWORD": vault.OrganizerDb.Password,
	}

	saveEnv(vars, serversEnvDir+"/organizer-db/.env")
}
