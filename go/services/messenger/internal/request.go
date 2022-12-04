package internal

import (
	"errors"
	"fmt"
)

type WSPayload struct {
	Action  string `json:"action"`
	Message string `json:"message"`
}

type WSRequest struct {
	Payload          WSPayload
	ClientConnection *ClientConnection
}

func NewWSRequest(payload WSPayload, conn *ClientConnection) (*WSRequest, error) {
	if payload.Action != "broadcast" {
		return nil, errors.New(fmt.Sprintf("Invalid action %q, expected %q",
			payload.Action,
			"broadcast",
		))
	}
	return &WSRequest{
		Payload:          payload,
		ClientConnection: conn,
	}, nil
}
