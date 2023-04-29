package participants

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"messenger-api/internal/modules/authentication"
	"net/http"
	"time"
)

type Repository struct {
	apiUrl         string
	apiKey         string
	maxRequestTime time.Duration
}

func NewRepository(apiUrl, apiKey string, maxRequestTime time.Duration) *Repository {
	return &Repository{
		apiUrl:         apiUrl,
		apiKey:         apiKey,
		maxRequestTime: maxRequestTime,
	}
}

func (r *Repository) FindOne(participantId int32) (*authentication.Participant, error) {
	ctx, cancel := context.WithTimeout(context.Background(), r.maxRequestTime)
	defer cancel()

	url := fmt.Sprintf("%s/users/%d", r.apiUrl, participantId)
	request, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return nil, fmt.Errorf("could not prepare get participant request: %w\n", err)
	}
	request.Header = map[string][]string{
		"Authorization": {"Bearer " + r.apiKey},
		"Content-Type":  {"application/json"},
	}

	response, err := http.DefaultClient.Do(request)
	if err != nil {
		return nil, fmt.Errorf("could not send get participant request: %w", err)
	}
	defer response.Body.Close()

	if response.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("get participant response returned with status %d", response.StatusCode)
	}

	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return nil, fmt.Errorf("could not read get participant response: %w", err)
	}

	participant := &authentication.Participant{}
	err = json.Unmarshal(body, &participant)
	if err != nil {
		return nil, fmt.Errorf("could not unmarshal get participant response: %w", err)
	}

	return participant, nil
}
