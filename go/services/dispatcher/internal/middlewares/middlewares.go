package middlewares

import (
	"dispatcher/internal/response"
	"encoding/base64"
	"errors"
	"golang.org/x/crypto/bcrypt"
	"net/http"
	"strings"
)

type BasicAuth struct {
	Handler      http.Handler
	Responder    *response.Responder
	Username     string
	PasswordHash string
}

func (a BasicAuth) writeInvalidTokenError(w http.ResponseWriter) {
	a.Responder.WriteError(w, errors.New("invalid token"), http.StatusUnauthorized)
}

func (a BasicAuth) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	authorizationHeader := r.Header.Get("Authorization")
	headerParts := strings.Split(authorizationHeader, " ")
	if len(headerParts) != 2 || headerParts[0] != "Basic" {
		a.writeInvalidTokenError(w)
		return
	}

	token, err := base64.StdEncoding.DecodeString(headerParts[1])
	if err != nil {
		a.writeInvalidTokenError(w)
		return
	}
	tokenParts := strings.Split(string(token), ":")
	if len(tokenParts) != 2 || tokenParts[0] != a.Username {
		a.writeInvalidTokenError(w)
		return
	}
	err = bcrypt.CompareHashAndPassword([]byte(a.PasswordHash), []byte(tokenParts[1]))
	if err != nil {
		a.writeInvalidTokenError(w)
		return
	}

	a.Handler.ServeHTTP(w, r)
}

type EnableCors struct {
	Handler http.Handler
}

func (m EnableCors) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, PATCH, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type,Authorization")
	m.Handler.ServeHTTP(w, r)
}
