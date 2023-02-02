package current_user

import (
	"context"
	"github.com/pascaldekloe/jwt"
	"log"
	"net/http"
	"participant-api/internal/modules/api/common/constants"
	"participant-api/internal/modules/api/common/responses"
	"participant-api/internal/modules/infrastructure/users"
	"strconv"
	"strings"
	"time"
)

type paramsUserKey struct{}

var ParamsUserKey = paramsUserKey{}

type Middleware struct {
	handler         http.Handler
	jwtSecret       string
	usersRepository *users.Repository
	responder       *responses.Responder
}

func NewMiddleware(jwtSecret string, usersRepository *users.Repository, logger *log.Logger) *Middleware {
	return &Middleware{
		usersRepository: usersRepository,
		jwtSecret:       jwtSecret,
		responder:       responses.NewResponder(logger),
	}
}

func (m *Middleware) getUserByAuthorizationHeader(authorizationHeader string) (*users.User, error) {
	headerParts := strings.Split(authorizationHeader, " ")
	if len(headerParts) != 2 || headerParts[0] != "Bearer" {
		return nil, responses.ErrInvalidHeader
	}

	tokenParts := strings.Split(headerParts[1], ":")
	if len(tokenParts) != 2 || tokenParts[0] != constants.ParticipantTokenPrefix {
		return nil, responses.ErrInvalidToken
	}

	jwtToken := tokenParts[1]
	claims, err := jwt.HMACCheck([]byte(jwtToken), []byte(m.jwtSecret))
	if err != nil ||
		!claims.Valid(time.Now()) ||
		!claims.AcceptAudience(constants.TokenIssuer) ||
		claims.Issuer != constants.TokenIssuer {
		return nil, responses.ErrInvalidToken
	}

	userId, err := strconv.ParseInt(claims.Subject, 10, 64)
	if err != nil {
		return nil, responses.ErrInvalidToken
	}
	user, err := m.usersRepository.GetUserById(int(userId))
	if err != nil {
		return nil, responses.ErrInvalidToken
	}
	if claims.Issued.Time().Before(user.TimeSignOut) {
		return nil, responses.ErrInvalidToken
	}

	return user, nil
}

func (m *Middleware) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	user, err := m.getUserByAuthorizationHeader(r.Header.Get("Authorization"))
	if err != nil {
		m.responder.WriteError(w, err, http.StatusUnauthorized)
		return
	}

	ctx := context.WithValue(r.Context(), ParamsUserKey, user)
	m.handler.ServeHTTP(w, r.WithContext(ctx))
}

func (m *Middleware) HandlerFunc(f http.HandlerFunc) http.HandlerFunc {
	h := &Middleware{
		handler:         f,
		jwtSecret:       m.jwtSecret,
		usersRepository: m.usersRepository,
		responder:       m.responder,
	}

	return h.ServeHTTP
}
