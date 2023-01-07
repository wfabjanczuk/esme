package users

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/pascaldekloe/jwt"
	"golang.org/x/crypto/bcrypt"
	"io"
	"log"
	"net/http"
	"participant-api/internal/config"
	"participant-api/internal/middlewares"
	"participant-api/internal/response"
	"strconv"
	"strings"
	"time"
)

const ParticipantTokenPrefix = "participant"
const TokenIssuer = "esme.com"

var SignInError = errors.New("invalid email or password")
var InvalidTokenError = errors.New("invalid token")

type authController struct {
	usersRepository *UsersRepository
	responder       *response.Responder
	jwtSecret       string
	logger          *log.Logger
}

func newAuthController(usersRepository *UsersRepository, config *config.Config, logger *log.Logger) *authController {
	return &authController{
		usersRepository: usersRepository,
		responder:       response.NewResponder(logger),
		jwtSecret:       config.JwtSecret,
		logger:          logger,
	}
}

type authenticatedUser struct {
	User *User  `json:"user"`
	JWT  string `json:"jwt"`
}

func (c *authController) signUp(w http.ResponseWriter, r *http.Request) {
	body, err := io.ReadAll(r.Body)
	if err != nil {
		c.responder.WriteError(w, err, http.StatusBadRequest)
		return
	}

	signUpDTO := &SignUpDTO{}
	err = json.Unmarshal(body, signUpDTO)
	if err != nil {
		c.responder.WriteError(w, err, http.StatusBadRequest)
		return
	}
	if err = signUpDTO.Validate(); err != nil {
		c.responder.WriteError(w, err, http.StatusBadRequest)
		return
	}

	user, err := c.usersRepository.InsertUser(signUpDTO)
	if err != nil {
		c.responder.WriteError(w, err, http.StatusBadRequest)
		return
	}

	token, err := c.generateJWT(user)
	if err != nil {
		c.responder.WriteError(w, err, http.StatusInternalServerError)
		return
	}

	c.responder.WriteJson(w, http.StatusCreated, authenticatedUser{
		User: user,
		JWT:  token,
	})
}

func (c *authController) signIn(w http.ResponseWriter, r *http.Request) {
	body, err := io.ReadAll(r.Body)
	if err != nil {
		c.responder.WriteError(w, err, http.StatusBadRequest)
		return
	}

	signInDTO := &SignInDTO{}
	err = json.Unmarshal(body, signInDTO)
	if err != nil {
		c.responder.WriteError(w, err, http.StatusBadRequest)
		return
	}
	if err = signInDTO.Validate(); err != nil {
		c.responder.WriteError(w, SignInError, http.StatusBadRequest)
		return
	}

	user, err := c.usersRepository.GetUserByEmail(signInDTO.Email)
	if err != nil {
		c.responder.WriteError(w, SignInError, http.StatusBadRequest)
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(signInDTO.Password))
	if err != nil {
		c.responder.WriteError(w, SignInError, http.StatusBadRequest)
		return
	}

	token, err := c.generateJWT(user)
	if err != nil {
		c.responder.WriteError(w, err, http.StatusInternalServerError)
		return
	}

	c.responder.WriteJson(w, http.StatusOK, authenticatedUser{
		User: user,
		JWT:  token,
	})
}

func (c *authController) generateJWT(user *User) (string, error) {
	var claims jwt.Claims
	claims.Subject = fmt.Sprint(user.ID)
	claims.Issued = jwt.NewNumericTime(time.Now())
	claims.NotBefore = jwt.NewNumericTime(time.Now())
	claims.Expires = jwt.NewNumericTime(time.Now().Add(24 * time.Hour))
	claims.Issuer = TokenIssuer
	claims.Audiences = []string{TokenIssuer}

	jwtBytes, err := claims.HMACSign(jwt.HS256, []byte(c.jwtSecret))
	if err != nil {
		return "", err
	}

	return fmt.Sprintf("%s:%s", ParticipantTokenPrefix, string(jwtBytes)), nil
}

func (c *authController) getUserByAuthorizationHeader(authorizationHeader string) (*User, error) {
	headerParts := strings.Split(authorizationHeader, " ")
	if len(headerParts) != 2 || headerParts[0] != "Bearer" {
		return nil, errors.New("invalid authorization header")
	}

	tokenParts := strings.Split(headerParts[1], ":")
	if len(tokenParts) != 2 || tokenParts[0] != ParticipantTokenPrefix {
		return nil, InvalidTokenError
	}

	jwtToken := tokenParts[1]
	claims, err := jwt.HMACCheck([]byte(jwtToken), []byte(c.jwtSecret))
	if err != nil ||
		!claims.Valid(time.Now()) ||
		!claims.AcceptAudience(TokenIssuer) ||
		claims.Issuer != TokenIssuer {
		return nil, InvalidTokenError
	}

	userId, err := strconv.ParseInt(claims.Subject, 10, 64)
	if err != nil {
		return nil, InvalidTokenError
	}
	user, err := c.usersRepository.GetUserByID(int(userId))
	if err != nil {
		return nil, InvalidTokenError
	}
	if claims.Issued.Time().Before(user.UpdatedPasswordAt) {
		return nil, InvalidTokenError
	}

	return user, nil
}

func (c *authController) Authenticate(next func(w http.ResponseWriter, r *http.Request)) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		user, err := c.getUserByAuthorizationHeader(r.Header.Get("Authorization"))
		if err != nil {
			c.responder.WriteError(w, err, http.StatusUnauthorized)
			return
		}

		ctx := context.WithValue(r.Context(), middlewares.ParamsUserKey, user)
		next(w, r.WithContext(ctx))
	}
}
