package participants

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
)

func (m *Manager) getSignUpDto(n int) signUpRequestDTO {
	return signUpRequestDTO{
		Email:           fmt.Sprintf("participant_%d_%d@performance.com", m.timeStarted.Unix(), n),
		Password:        "performance",
		ConfirmPassword: "performance",
		PhoneNumber:     "+48100200300",
	}
}

func (m *Manager) newParticipantToken(n int) (string, error) {
	url := fmt.Sprintf("%s/auth/sign-up", m.config.ParticipantApiUrl)

	payload, err := json.Marshal(m.getSignUpDto(n))
	if err != nil {
		log.Panicf("%s: error marshaling signUpDto: %s", url, err)
	}

	req, err := http.NewRequest(http.MethodPost, url, bytes.NewBuffer(payload))
	if err != nil {
		log.Panicf("%s: error creating request: %s", url, err)
	}

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", fmt.Errorf("%s: error sending request: %s", url, err)
	}
	defer res.Body.Close()

	bodyBytes, err := io.ReadAll(res.Body)
	if err != nil {
		return "", fmt.Errorf("%s: error reading response body: %s", url, err)
	}

	if res.StatusCode != http.StatusCreated {
		return "", fmt.Errorf(
			"%s: responded with status code: %d instead of: %d", url, res.StatusCode, http.StatusCreated,
		)
	}

	var signUpResponse signUpResponseDTO
	err = json.Unmarshal(bodyBytes, &signUpResponse)
	if err != nil {
		return "", fmt.Errorf("%s: error unmarshaling response body: %s", url, err)
	}

	return signUpResponse.Token, nil
}

func (m *Manager) getCreateChatRequestDto() createChatRequestDto {
	return createChatRequestDto{
		EventId:     m.config.EventId,
		Description: "Performance test chat request",
	}
}

func (m *Manager) newChatRequest(token string) error {
	url := fmt.Sprintf("%s/chat-requests", m.config.ParticipantApiUrl)

	payload, err := json.Marshal(m.getCreateChatRequestDto())
	if err != nil {
		log.Panicf("%s: error marshaling signUpDto: %s", url, err)
	}

	req, err := http.NewRequest(http.MethodPost, url, bytes.NewBuffer(payload))
	if err != nil {
		log.Panicf("%s error creating request: %s", url, err)
	}

	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", token))
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return fmt.Errorf("%s: error sending request: %s", url, err)
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		return fmt.Errorf("%s: responded with status code: %d instead of %d", url, res.StatusCode, http.StatusOK)
	}

	return nil
}
