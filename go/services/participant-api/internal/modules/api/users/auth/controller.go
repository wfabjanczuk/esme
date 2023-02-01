package auth

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/pascaldekloe/jwt"
	"golang.org/x/crypto/bcrypt"
	"io"
	"log"
	"net/http"
	"participant-api/internal/modules/api/common/constants"
	"participant-api/internal/modules/api/common/requests"
	"participant-api/internal/modules/api/common/responses"
	"participant-api/internal/modules/infrastructure/users"
	"time"
)

var signInError = errors.New("invalid email or password")
var unexpectedError = errors.New("unexpected error")

type Controller struct {
	jwtSecret       string
	usersRepository *users.Repository
	responder       *responses.Responder
}

func NewController(jwtSecret string, usersRepository *users.Repository, logger *log.Logger) *Controller {
	return &Controller{
		jwtSecret:       jwtSecret,
		usersRepository: usersRepository,
		responder:       responses.NewResponder(logger),
	}
}

type authenticatedUser struct {
	User  *users.User `json:"user"`
	Token string      `json:"token"`
}

func (c *Controller) SignUp(w http.ResponseWriter, r *http.Request) {
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

	user, err := c.usersRepository.InsertUser(
		&users.User{
			Email:       signUpDTO.Email,
			Password:    signUpDTO.Password,
			PhoneNumber: signUpDTO.PhoneNumber,
		},
	)
	if err != nil {
		c.responder.WriteError(w, err, http.StatusBadRequest)
		return
	}

	token, err := c.generateJwt(user)
	if err != nil {
		c.responder.WriteError(w, err, http.StatusInternalServerError)
		return
	}

	c.responder.WriteJson(
		w, http.StatusCreated, authenticatedUser{
			User:  user,
			Token: token,
		},
	)
}

func (c *Controller) SignIn(w http.ResponseWriter, r *http.Request) {
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

	user, err := c.usersRepository.GetUserByEmail(signInDTO.Email)
	if err != nil {
		c.responder.WriteError(w, signInError, http.StatusBadRequest)
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(signInDTO.Password))
	if err != nil {
		c.responder.WriteError(w, signInError, http.StatusBadRequest)
		return
	}

	token, err := c.generateJwt(user)
	if err != nil {
		c.responder.WriteError(w, err, http.StatusInternalServerError)
		return
	}

	c.responder.WriteJson(
		w, http.StatusOK, authenticatedUser{
			User:  user,
			Token: token,
		},
	)
}

func (c *Controller) SignOut(w http.ResponseWriter, r *http.Request) {
	user, err := requests.GetCurrentUser(r)
	if err != nil {
		c.responder.WriteError(w, unexpectedError, http.StatusInternalServerError)
		return
	}
	err = c.usersRepository.SignOut(user)
	if err != nil {
		c.responder.WriteError(w, unexpectedError, http.StatusInternalServerError)
		return
	}

	c.responder.WriteEmptyResponse(w, 200)
}

func (c *Controller) generateJwt(user *users.User) (string, error) {
	var claims jwt.Claims
	claims.Subject = fmt.Sprint(user.Id)
	claims.Issued = jwt.NewNumericTime(time.Now())
	claims.NotBefore = jwt.NewNumericTime(time.Now())
	claims.Expires = jwt.NewNumericTime(time.Now().Add(24 * time.Hour))
	claims.Issuer = constants.TokenIssuer
	claims.Audiences = []string{constants.TokenIssuer}

	jwtBytes, err := claims.HMACSign(jwt.HS256, []byte(c.jwtSecret))
	if err != nil {
		return "", err
	}

	return fmt.Sprintf("%s:%s", constants.ParticipantTokenPrefix, string(jwtBytes)), nil
}
