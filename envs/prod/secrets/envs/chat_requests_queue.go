package envs

import "secrets/vault"

func generateChatRequestsQueueEnv(vault vault.Vault) {
	vars := map[string]string{
		"QUEUE_USER":     vault.Queue.User,
		"QUEUE_PASSWORD": vault.Queue.Password,
	}

	saveEnv(vars, serversEnvDir+"/chat-requests-queue/.env")
}
