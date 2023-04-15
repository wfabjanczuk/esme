package events

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"participant-api/internal/modules/api/common/api_errors"
	"strconv"
	"time"
)

type Repository struct {
	organizerApiUrl string
	organizerApiKey string
	maxRequestTime  time.Duration
}

func NewRepository(organizerApiUrl, organizerApiKey string, maxQueryTime time.Duration) *Repository {
	return &Repository{
		organizerApiUrl: organizerApiUrl,
		organizerApiKey: organizerApiKey,
		maxRequestTime:  maxQueryTime,
	}
}

func (r *Repository) GetEventById(id int) (*Event, error) {
	eventUrl := r.organizerApiUrl + "/api/events/" + strconv.Itoa(id)
	body, err := r.getRawOrganizerApiResponse(eventUrl)
	if err != nil {
		return nil, err
	}

	var event *Event
	err = json.Unmarshal(body, &event)
	if err != nil {
		return nil, fmt.Errorf("could not unmarshal organizer api response: %w", err)
	}
	return event, nil
}

type Filters struct {
	Query string
	From  time.Time
	To    time.Time
}

func (r *Repository) FindEvents(filters Filters) ([]*Event, error) {
	queryValues := url.Values{}
	if filters.Query != "" {
		queryValues.Set("query", filters.Query)
	}
	if !filters.From.IsZero() {
		queryValues.Set("from", filters.From.Format(time.RFC3339))
	}
	if !filters.To.IsZero() {
		queryValues.Set("to", filters.To.Format(time.RFC3339))
	}

	eventsUrl := r.organizerApiUrl + "/api/events?" + queryValues.Encode()
	body, err := r.getRawOrganizerApiResponse(eventsUrl)
	if err != nil {
		return nil, err
	}

	var events []*Event
	err = json.Unmarshal(body, &events)
	if err != nil {
		return nil, fmt.Errorf("could not unmarshal organizer api response: %w", err)
	}

	return events, nil
}

func (r *Repository) getRawOrganizerApiResponse(url string) ([]byte, error) {
	ctx, cancel := context.WithTimeout(context.Background(), r.maxRequestTime)
	defer cancel()

	request, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return nil, fmt.Errorf("could not prepare organizer api request: %w\n", err)
	}
	request.Header = map[string][]string{
		"Authorization": {"Bearer " + r.organizerApiKey},
		"Content-Type":  {"application/json"},
	}

	response, err := http.DefaultClient.Do(request)
	if err != nil {
		return nil, fmt.Errorf("could not send organizer api request: %w", err)
	}
	defer response.Body.Close()

	if response.StatusCode == http.StatusNotFound {
		return nil, api_errors.ErrApiResourceNotFound
	}

	if response.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("organizer api response returned with status %d", response.StatusCode)
	}

	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return nil, fmt.Errorf("could not read organizer api response: %w", err)
	}

	return body, nil
}
