package participants

import (
	"errors"
	"github.com/gorilla/websocket"
	"log"
	"messenger-api/internal/modules/ws/connections"
	"messenger-api/internal/modules/ws/writers/chats"
	"os"
	"time"
)

type Consumer struct {
	out    *chats.Writer
	logger *log.Logger
}

func NewConsumer(out *chats.Writer, logger *log.Logger) *Consumer {
	return &Consumer{
		out:    out,
		logger: logger,
	}
}

type wsRequest struct {
	Payload string `json:"payload"`
}

type task struct {
	ChatId        string
	Payload       string
	FromOrganizer int32
	AuthorId      int32
	TimeReceived  time.Time
}

func (c *Consumer) ListenOnConnection(conn *connections.ParticipantConnection) {
	defer func() {
		if r := recover(); r != nil {
			c.logger.Printf("error %v\n", r)
		}
	}()

	for {
		var request wsRequest
		err := conn.Ws.ReadJSON(&request)
		if err != nil {
			if os.IsTimeout(err) {
				c.logger.Printf("participant %s timeout\n", conn.Ws.RemoteAddr())
				conn.Close()
				return
			}
			closeError := &websocket.CloseError{}
			if errors.As(err, &closeError) {
				c.logger.Printf("close error: %s\n", err)
				return
			}
			c.logger.Printf("unexpected error: %s\n", err)
		} else {
			conn.ResetReadTimer()
			c.logger.Printf(
				"new message from participant %s, payload: \"%s\"\n",
				conn.Ws.RemoteAddr(),
				request.Payload,
			)
			go c.handleTask(
				task{
					ChatId:        "63cf08b1d38a3682abc90575",
					Payload:       request.Payload,
					FromOrganizer: 0,
					AuthorId:      conn.Participant.Id,
					TimeReceived:  time.Now(),
				},
			)
		}
	}
}

func (c *Consumer) handleTask(task task) {

}
