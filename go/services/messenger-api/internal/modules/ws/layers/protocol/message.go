package protocol

import (
	"encoding/json"
	"time"
)

type Message struct {
	Type         string          `json:"type"`
	Payload      json.RawMessage `json:"payload"`
	TimeReceived time.Time       `json:"-"`
}
