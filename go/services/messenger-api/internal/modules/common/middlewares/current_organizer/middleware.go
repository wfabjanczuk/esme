package current_organizer

import (
	"context"
	"fmt"
	"log"
	"messenger-api/internal/modules/authentication"
	"messenger-api/internal/modules/rest/responses"
	"net/http"
)

type paramsOrganizerKey struct{}

var ParamsOrganizerKey = paramsOrganizerKey{}

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

func (m *Middleware) getOrganizerFromRequest(authorizationHeader string) (*authentication.Organizer, error) {
	parseHeaderResult := m.authenticator.ParseHeader(authorizationHeader)
	if parseHeaderResult.Err != nil {
		return nil, parseHeaderResult.Err
	}

	if !parseHeaderResult.IsOrganizer {
		return nil, fmt.Errorf("invalid token type")
	}

	return m.authenticator.AuthenticateOrganizer(parseHeaderResult.Token)
}

func (m *Middleware) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	user, err := m.getOrganizerFromRequest(r.Header.Get("Authorization"))
	if err != nil {
		m.responder.WriteError(w, err, http.StatusUnauthorized)
		return
	}

	ctx := context.WithValue(r.Context(), ParamsOrganizerKey, user)
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
