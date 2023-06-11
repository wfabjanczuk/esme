package envs

import (
	"secrets/vault"
	"strconv"
)

func generateOrganizerApiEnv(vault vault.Vault) {
	vars := map[string]string{
		"DB_HOST":              vault.OrganizerDb.Host,
		"DB_PORT":              strconv.Itoa(vault.OrganizerDb.Port),
		"DB_NAME":              vault.OrganizerDb.DbName,
		"DB_USER":              vault.OrganizerDb.User,
		"DB_PASSWORD":          vault.OrganizerDb.Password,
		"SUPER_ADMIN_EMAIL":    vault.OrganizerApi.SuperAdminEmail,
		"SUPER_ADMIN_PASSWORD": vault.OrganizerApi.SuperAdminPassword,
		"JWT_SECRET":           vault.OrganizerApi.JwtSecret,
		"ORGANIZER_API_KEY":    vault.OrganizerApi.ApiKey,
	}

	saveEnv(vars, serversEnvDir+"/organizer-api/.env")
}
