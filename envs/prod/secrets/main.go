package main

import (
	"secrets/envs"
	"secrets/vault"
)

func main() {
	envs.GenerateEnvs(vault.NewVault("vault.json", "hosts.json"))
}
