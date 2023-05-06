package current_participant

import (
	"context"
	"fmt"
	"log"
	"messenger-api/internal/modules/authentication"
	"messenger-api/internal/modules/rest/responses"
	"net/http"
)

type paramsParticipantKey struct{}

var ParamsParticipantKey = paramsParticipantKey{}

type Middleware struct {
	handler       http.Handler
	authenticator *authentication.Authenticator
	responder     *responses.Responder
}

func NewMiddleware(authenticator *authentication.Authenticator, logger *log.Logger) *Middleware {
	return &Middleware{
		authenticator: authenticator,
		responder:     responses.NewResponder(logger),
	}
}

func (m *Middleware) getParticipantFromRequest(authorizationHeader string) (*authentication.Participant, error) {
	parseHeaderResult := m.authenticator.ParseHeader(authorizationHeader)
	if parseHeaderResult.Err != nil {
		return nil, parseHeaderResult.Err
	}

	if parseHeaderResult.IsOrganizer {
		return nil, fmt.Errorf("invalid token type")
	}

	return m.authenticator.AuthenticateParticipant(parseHeaderResult.Token)
}

func (m *Middleware) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	user, err := m.getParticipantFromRequest(r.Header.Get("Authorization"))
	if err != nil {
		m.responder.WriteError(w, err, http.StatusUnauthorized)
		return
	}

	ctx := context.WithValue(r.Context(), ParamsParticipantKey, user)
	m.handler.ServeHTTP(w, r.WithContext(ctx))
}

func (m *Middleware) HandlerFunc(f http.HandlerFunc) http.HandlerFunc {
	h := &Middleware{
		handler:       f,
		authenticator: m.authenticator,
		responder:     m.responder,
	}

	return h.ServeHTTP
}
