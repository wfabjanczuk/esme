package participants

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"messenger-api/internal/modules/authentication"
	"net/http"
	"time"
)

type Repository struct {
	participantApiUrl string
	participantApiKey string
	maxRequestTime    time.Duration
}

func NewRepository(participantApiUrl, participantApiKey string, maxRequestTime time.Duration) *Repository {
	return &Repository{
		participantApiUrl: participantApiUrl,
		participantApiKey: participantApiKey,
		maxRequestTime:    maxRequestTime,
	}
}

func (r *Repository) FindByIds(participantIds []int32) (map[int32]*authentication.Participant, error) {
	ctx, cancel := context.WithTimeout(context.Background(), r.maxRequestTime)
	defer cancel()

	payload, err := json.Marshal(
		struct {
			Ids []int32 `json:"ids"`
		}{Ids: participantIds},
	)
	if err != nil {
		return nil, fmt.Errorf("could not marshal get participants request: %w\n", err)
	}

	url := fmt.Sprintf("%s/users", r.participantApiUrl)
	request, err := http.NewRequestWithContext(ctx, http.MethodGet, url, bytes.NewBuffer(payload))
	if err != nil {
		return nil, fmt.Errorf("could not prepare get participants request: %w\n", err)
	}
	request.Header = map[string][]string{
		"Authorization": {"Bearer " + r.participantApiKey},
		"Content-Type":  {"application/json"},
	}

	response, err := http.DefaultClient.Do(request)
	if err != nil {
		return nil, fmt.Errorf("could not send get participants request: %w", err)
	}
	defer response.Body.Close()

	if response.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("get participants response returned with status %d", response.StatusCode)
	}

	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return nil, fmt.Errorf("could not read get participants response: %w", err)
	}

	participantsMap := make(map[int32]*authentication.Participant, len(participantIds))
	err = json.Unmarshal(body, &participantsMap)
	if err != nil {
		return nil, fmt.Errorf("could not unmarshal get participants response: %w", err)
	}

	return participantsMap, nil
}
