package organizer

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
)

func (m *Manager) getSignInDto() signInDTO {
	return signInDTO{
		Email:    m.config.OrganizerEmail,
		Password: m.config.OrganizerPassword,
	}
}

func (m *Manager) getOrganizerToken() (string, error) {
	url := fmt.Sprintf("%s/auth/sign-in", m.config.OrganizerApiUrl)
	payload, err := json.Marshal(m.getSignInDto())
	if err != nil {
		log.Panicf("%s: error marshaling signInDto: %s", url, err)
	}

	req, err := http.NewRequest(http.MethodPost, url, bytes.NewBuffer(payload))
	if err != nil {
		log.Panicf("%s: error creating request: %s", url, err)
	}
	req.Header.Set("Content-Type", "application/json")

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", fmt.Errorf("%s: error sending request: %s", url, err)
	}
	defer res.Body.Close()

	bodyBytes, err := io.ReadAll(res.Body)
	if err != nil {
		return "", fmt.Errorf("%s: error reading response body: %s", url, err)
	}

	if res.StatusCode != http.StatusOK {
		return "", fmt.Errorf(
			"%s: responded with status code: %d instead of: %d", url, res.StatusCode, http.StatusOK,
		)
	}

	var signInResponse signInResponseDTO
	err = json.Unmarshal(bodyBytes, &signInResponse)
	if err != nil {
		return "", fmt.Errorf("%s: error unmarshaling response body: %s", url, err)
	}

	return signInResponse.Token, nil
}
