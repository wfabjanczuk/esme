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
	"participant-api/internal/middlewares"
	"participant-api/internal/response"
	"strconv"
	"strings"
	"time"
)

const participantTokenPrefix = "participant"
const tokenIssuer = "esme.com"

var signInError = errors.New("invalid email or password")
var invalidTokenError = errors.New("invalid token")

type authController struct {
	usersRepository *usersRepository
	responder       *response.Responder
	jwtSecret       string
	logger          *log.Logger
}

func newAuthController(usersRepository *usersRepository, jwtSecret string, logger *log.Logger) *authController {
	return &authController{
		usersRepository: usersRepository,
		responder:       response.NewResponder(logger),
		jwtSecret:       jwtSecret,
		logger:          logger,
	}
}

type authenticatedUser struct {
	User  *User  `json:"user"`
	Token string `json:"token"`
}

func (c *authController) signUp(w http.ResponseWriter, r *http.Request) {
	body, err := io.ReadAll(r.Body)
	if err != nil {
		c.responder.WriteError(w, err, http.StatusBadRequest)
		return
	}

	signUpDTO := &signUpDTO{}
	err = json.Unmarshal(body, signUpDTO)
	if err != nil {
		c.responder.WriteError(w, err, http.StatusBadRequest)
		return
	}
	if err = signUpDTO.validate(); err != nil {
		c.responder.WriteError(w, err, http.StatusBadRequest)
		return
	}

	user, err := c.usersRepository.insertUser(signUpDTO)
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
		User:  user,
		Token: token,
	})
}

func (c *authController) signIn(w http.ResponseWriter, r *http.Request) {
	body, err := io.ReadAll(r.Body)
	if err != nil {
		c.responder.WriteError(w, err, http.StatusBadRequest)
		return
	}

	signInDTO := &signInDTO{}
	err = json.Unmarshal(body, signInDTO)
	if err != nil {
		c.responder.WriteError(w, err, http.StatusBadRequest)
		return
	}
	if err = signInDTO.validate(); err != nil {
		c.responder.WriteError(w, signInError, http.StatusBadRequest)
		return
	}

	user, err := c.usersRepository.getUserByEmail(signInDTO.Email)
	if err != nil {
		c.responder.WriteError(w, signInError, http.StatusBadRequest)
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(signInDTO.Password))
	if err != nil {
		c.responder.WriteError(w, signInError, http.StatusBadRequest)
		return
	}

	token, err := c.generateJWT(user)
	if err != nil {
		c.responder.WriteError(w, err, http.StatusInternalServerError)
		return
	}

	c.responder.WriteJson(w, http.StatusOK, authenticatedUser{
		User:  user,
		Token: token,
	})
}

func (c *authController) signOut(w http.ResponseWriter, r *http.Request) {
	user, err := GetUserFromRequest(r)
	if err != nil {
		c.responder.WriteError(w, UnexpectedError, http.StatusInternalServerError)
		return
	}
	err = c.usersRepository.signOut(user)
	if err != nil {
		c.responder.WriteError(w, UnexpectedError, http.StatusInternalServerError)
		return
	}

	c.responder.WriteEmptyResponse(w, 200)
}

func (c *authController) generateJWT(user *User) (string, error) {
	var claims jwt.Claims
	claims.Subject = fmt.Sprint(user.ID)
	claims.Issued = jwt.NewNumericTime(time.Now())
	claims.NotBefore = jwt.NewNumericTime(time.Now())
	claims.Expires = jwt.NewNumericTime(time.Now().Add(24 * time.Hour))
	claims.Issuer = tokenIssuer
	claims.Audiences = []string{tokenIssuer}

	JWTBytes, err := claims.HMACSign(jwt.HS256, []byte(c.jwtSecret))
	if err != nil {
		return "", err
	}

	return fmt.Sprintf("%s:%s", participantTokenPrefix, string(JWTBytes)), nil
}

func (c *authController) getUserByAuthorizationHeader(authorizationHeader string) (*User, error) {
	headerParts := strings.Split(authorizationHeader, " ")
	if len(headerParts) != 2 || headerParts[0] != "Bearer" {
		return nil, errors.New("invalid authorization header")
	}

	tokenParts := strings.Split(headerParts[1], ":")
	if len(tokenParts) != 2 || tokenParts[0] != participantTokenPrefix {
		return nil, invalidTokenError
	}

	jwtToken := tokenParts[1]
	claims, err := jwt.HMACCheck([]byte(jwtToken), []byte(c.jwtSecret))
	if err != nil ||
		!claims.Valid(time.Now()) ||
		!claims.AcceptAudience(tokenIssuer) ||
		claims.Issuer != tokenIssuer {
		return nil, invalidTokenError
	}

	userId, err := strconv.ParseInt(claims.Subject, 10, 64)
	if err != nil {
		return nil, invalidTokenError
	}
	user, err := c.usersRepository.getUserByID(int(userId))
	if err != nil {
		return nil, invalidTokenError
	}
	if claims.Issued.Time().Before(user.TimeSignOut) {
		return nil, invalidTokenError
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
