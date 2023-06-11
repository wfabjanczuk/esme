package envs

import "secrets/vault"

type participantUiEnv struct {
	ParticipantApiUrl string `json:"participant_api_url"`
	MessengerApiUrl   string `json:"messenger_api_url"`
	MessengerWsUrl    string `json:"messenger_ws_url"`
}

func generateParticipantUiEnv(vault vault.Vault) {
	vars := participantUiEnv{
		ParticipantApiUrl: vault.ParticipantApi.GetUrl(),
		MessengerApiUrl:   vault.MessengerApi.GetUrl(),
		MessengerWsUrl:    vault.MessengerApi.GetWs(),
	}

	saveEnvJson(vars, clientsEnvDir+"/participant-ui/config.json")
}
