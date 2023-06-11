package envs

import "secrets/vault"

type organizerUiEnv struct {
	OrganizerApiUrl string `json:"organizer_api_url"`
	MessengerApiUrl string `json:"messenger_api_url"`
	MessengerWsUrl  string `json:"messenger_ws_url"`
}

func generateOrganizerUiEnv(vault vault.Vault) {
	vars := organizerUiEnv{
		OrganizerApiUrl: vault.OrganizerApi.GetUrl(),
		MessengerApiUrl: vault.MessengerApi.GetUrl(),
		MessengerWsUrl:  vault.MessengerApi.GetWs(),
	}

	saveEnvJson(vars, clientsEnvDir+"/organizer-ui/config.json")
}
