package current_user

import (
	"context"
	"errors"
	"github.com/pascaldekloe/jwt"
	"log"
	"net/http"
	"participant-api/internal/modules/api/constants"
	"participant-api/internal/modules/api/responses"
	"participant-api/internal/modules/infrastructure/users"
	"strconv"
	"strings"
	"time"
)

type paramsUserKey struct{}

var (
	ParamsUserKey      = paramsUserKey{}
	EmptyUserError     = errors.New("empty user from request")
	MalformedUserError = errors.New("malformed user from request")
	invalidHeaderError = errors.New("invalid authorization header")
	invalidTokenError  = errors.New("invalid token")
)

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
		return nil, invalidHeaderError
	}

	tokenParts := strings.Split(headerParts[1], ":")
	if len(tokenParts) != 2 || tokenParts[0] != constants.ParticipantTokenPrefix {
		return nil, invalidTokenError
	}

	jwtToken := tokenParts[1]
	claims, err := jwt.HMACCheck([]byte(jwtToken), []byte(m.jwtSecret))
	if err != nil ||
		!claims.Valid(time.Now()) ||
		!claims.AcceptAudience(constants.TokenIssuer) ||
		claims.Issuer != constants.TokenIssuer {
		return nil, invalidTokenError
	}

	userId, err := strconv.ParseInt(claims.Subject, 10, 64)
	if err != nil {
		return nil, invalidTokenError
	}
	user, err := m.usersRepository.GetUserById(int(userId))
	if err != nil {
		return nil, invalidTokenError
	}
	if claims.Issued.Time().Before(user.TimeSignOut) {
		return nil, invalidTokenError
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
