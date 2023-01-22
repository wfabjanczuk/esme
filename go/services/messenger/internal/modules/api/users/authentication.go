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

var ErrUnknownUser = errors.New("unknown user")

const (
	authenticationTimeout = time.Second
	prefixOrganizer       = "organizer"
	prefixParticipant     = "participant"
)

type profile struct {
	ID       int32 `json:"id"`
	AgencyID int32 `json:"agencyId"`
}

type Authenticator struct {
	organizerApiUrl   string
	participantApiUrl string
	logger            *log.Logger
}

func NewAuthenticator(config *config.Config, logger *log.Logger) *Authenticator {
	return &Authenticator{
		organizerApiUrl:   config.OrganizerApiUrl,
		participantApiUrl: config.ParticipantApiUrl,
		logger:            logger,
	}
}

func (a *Authenticator) AuthenticateRequest(r *http.Request) (*User, error) {
	header := r.Header.Get("Authorization")
	headerParts := strings.Split(header, " ")
	if len(headerParts) != 2 || headerParts[0] != "Bearer" {
		return nil, ErrUnknownUser
	}

	return a.AuthenticateToken(headerParts[1])
}

func (a *Authenticator) AuthenticateToken(token string) (*User, error) {
	tokenParts := strings.Split(token, ":")
	if len(tokenParts) != 2 {
		return nil, ErrUnknownUser
	}

	userTypePrefix := tokenParts[0]
	switch {
	case userTypePrefix == prefixOrganizer:
		return a.authenticateOrganizer(token)
	case userTypePrefix == prefixParticipant:
		return a.authenticateParticipant(token)
	default:
		return nil, ErrUnknownUser
	}
}

func (a *Authenticator) authenticateOrganizer(token string) (*User, error) {
	profileUrl := a.organizerApiUrl + "profile"
	p, err := a.getProfile(profileUrl, token)
	if err != nil || p.AgencyID == 0 {
		return nil, ErrUnknownUser
	}

	return &User{
		id:       p.ID,
		agencyId: p.AgencyID,
		userType: userTypeOrganizer,
		token:    token,
	}, nil
}

func (a *Authenticator) authenticateParticipant(token string) (*User, error) {
	profileUrl := a.participantApiUrl + "profile"
	p, err := a.getProfile(profileUrl, token)
	if err != nil {
		return nil, ErrUnknownUser
	}

	return &User{
		id:       p.ID,
		userType: userTypeParticipant,
		token:    token,
	}, nil
}

func (a *Authenticator) getProfile(profileUrl, token string) (*profile, error) {
	rawProfile, err := a.getRawProfile(profileUrl, token)
	if err != nil {
		a.logger.Printf("could not fetch user profile: %s", err)
		return nil, ErrUnknownUser
	}

	p := &profile{}
	err = json.Unmarshal(rawProfile, &p)
	if err != nil {
		a.logger.Printf("could not read user profile: %s", err)
		return nil, ErrUnknownUser
	}

	return p, nil
}

func (a *Authenticator) getRawProfile(profileUrl, token string) ([]byte, error) {
	ctx, cancel := context.WithTimeout(context.Background(), authenticationTimeout)
	defer cancel()

	request, err := http.NewRequestWithContext(ctx, http.MethodGet, profileUrl, nil)
	if err != nil {
		return nil, fmt.Errorf("could not prepare authentication request: %w", err)
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
