package users

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"messenger/internal/config"
	"net/http"
	"strings"
	"time"
)

var ErrMalformedToken = errors.New("malformed token")
var ErrUnknownUser = errors.New("unknown user")

const (
	authenticationTimeout = time.Second
	prefixOrganizer       = "organizer"
	prefixParticipant     = "participant"
)

type Authenticator struct {
	organizerApiUrl   string
	participantApiUrl string
	logger            *log.Logger
}

func NewAuthenticator(cfg *config.Config, logger *log.Logger) *Authenticator {
	return &Authenticator{
		organizerApiUrl:   cfg.OrganizerApiUrl,
		participantApiUrl: cfg.ParticipantApiUrl,
		logger:            logger,
	}
}

type ParseHeaderResult struct {
	IsOrganizer bool
	Token       string
	Err         error
}

func (a *Authenticator) ParseHeader(authorizationHeader string) ParseHeaderResult {
	result := ParseHeaderResult{}

	headerParts := strings.Split(authorizationHeader, " ")
	if len(headerParts) != 2 || headerParts[0] != "Bearer" {
		result.Err = ErrMalformedToken
		return result
	}

	result.Token = headerParts[1]
	tokenParts := strings.Split(result.Token, ":")
	if len(tokenParts) != 2 {
		result.Err = ErrMalformedToken
		return result
	}

	if tokenParts[0] == prefixOrganizer {
		result.IsOrganizer = true
		return result
	}

	if tokenParts[0] == prefixParticipant {
		result.IsOrganizer = false
		return result
	}

	result.Err = ErrMalformedToken
	return result
}

func (a *Authenticator) AuthenticateOrganizer(token string) (*Organizer, error) {
	profileUrl := a.organizerApiUrl + "profile"
	rawProfile, err := a.getRawProfile(profileUrl, token)
	if err != nil {
		a.logger.Printf("could not fetch organizer profile: %s\n", err)
		return nil, ErrUnknownUser
	}

	organizer := &Organizer{}
	err = json.Unmarshal(rawProfile, &organizer)
	if err != nil {
		a.logger.Printf("could not read organizer profile: %s\n", err)
		return nil, ErrUnknownUser
	}

	return organizer, nil
}

func (a *Authenticator) AuthenticateParticipant(token string) (*Participant, error) {
	profileUrl := a.participantApiUrl + "profile"
	rawProfile, err := a.getRawProfile(profileUrl, token)
	if err != nil {
		a.logger.Printf("could not fetch participant profile: %s\n", err)
		return nil, ErrUnknownUser
	}

	participant := &Participant{}
	err = json.Unmarshal(rawProfile, &participant)
	if err != nil {
		a.logger.Printf("could not read participant profile: %s\n", err)
		return nil, ErrUnknownUser
	}

	return participant, nil
}

func (a *Authenticator) getRawProfile(profileUrl, token string) ([]byte, error) {
	ctx, cancel := context.WithTimeout(context.Background(), authenticationTimeout)
	defer cancel()

	request, err := http.NewRequestWithContext(ctx, http.MethodGet, profileUrl, nil)
	if err != nil {
		return nil, fmt.Errorf("could not prepare authentication request: %w\n", err)
	}
	request.Header = map[string][]string{
		"Authorization": {"Bearer " + token},
		"Content-Type":  {"application/json"},
	}

	response, err := http.DefaultClient.Do(request)
	if err != nil {
		return nil, fmt.Errorf("could not send authentication request: %w", err)
	}
	defer response.Body.Close()

	if response.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("authentication response returned with status %d", response.StatusCode)
	}

	profile, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return nil, fmt.Errorf("could not read authentication response: %w", err)
	}

	return profile, nil
}
