package responses

import (
	"encoding/json"
	"log"
	"net/http"
)

type Responder struct {
	logger *log.Logger
}

func NewResponder(logger *log.Logger) *Responder {
	return &Responder{
		logger: logger,
	}
}

type ErrorMessage struct {
	StatusCode int    `json:"statusCode"`
	Message    string `json:"message"`
	Error      string `json:"error"`
}

func (r *Responder) WriteError(w http.ResponseWriter, error error, status int) {
	err := r.WriteJson(
		w, status, ErrorMessage{
			StatusCode: status,
			Message:    error.Error(),
			Error:      http.StatusText(status),
		},
	)
	if err != nil {
		r.logger.Println(err)
	}
}

func (r *Responder) WriteJson(w http.ResponseWriter, statusCode int, data interface{}) error {
	output, err := json.Marshal(data)
	if err != nil {
		return err
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)

	_, err = w.Write(output)
	if err != nil {
		r.logger.Println(err)
		return nil
	}

	r.logger.Println(string(output))
	return nil
}

func (r *Responder) WriteEmptyResponse(w http.ResponseWriter, statusCode int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
}
