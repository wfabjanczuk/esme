package api_key

import (
	"log"
	"net/http"
	"participant-api/internal/modules/api/common/api_errors"
	"participant-api/internal/modules/api/common/responses"
	"strings"
)

type Middleware struct {
	handler           http.Handler
	participantApiKey string
	responder         *responses.Responder
}

func NewMiddleware(participantApiKey string, logger *log.Logger) *Middleware {
	return &Middleware{
		participantApiKey: participantApiKey,
		responder:         responses.NewResponder(logger),
	}
}

func (m *Middleware) validateApiKey(authorizationHeader string) error {
	headerParts := strings.Split(authorizationHeader, " ")
	if len(headerParts) != 2 || headerParts[0] != "Bearer" {
		return api_errors.ErrInvalidHeader
	}

	apiKey := headerParts[1]
	if apiKey != m.participantApiKey {
		return api_errors.ErrInvalidApiKey
	}

	return nil
}

func (m *Middleware) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	err := m.validateApiKey(r.Header.Get("Authorization"))
	if err != nil {
		m.responder.WriteError(w, err, http.StatusUnauthorized)
		return
	}

	m.handler.ServeHTTP(w, r)
}

func (m *Middleware) HandlerFunc(f http.HandlerFunc) http.HandlerFunc {
	h := &Middleware{
		handler:           f,
		participantApiKey: m.participantApiKey,
		responder:         m.responder,
	}

	return h.ServeHTTP
}
