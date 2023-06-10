package envs

import "secrets/vault"

func generateMessengerDbEnv(vault vault.Vault) {
	vars := map[string]string{
		"MESSENGER_DB_USER":     vault.MessengerDb.User,
		"MESSENGER_DB_PASSWORD": vault.MessengerDb.Password,
	}

	saveEnv(vars, "../servers/messenger-db/.env")
}
