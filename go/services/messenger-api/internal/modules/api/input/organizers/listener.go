package organizers

import (
	"errors"
	"github.com/gorilla/websocket"
	"log"
	"messenger-api/internal/modules/api/connections"
	"messenger-api/internal/modules/api/output"
	"messenger-api/internal/modules/infrastructure/messages"
	"os"
	"time"
)

type Listener struct {
	outputManager *output.Manager
	logger        *log.Logger
}

func NewListener(outputManager *output.Manager, logger *log.Logger) *Listener {
	return &Listener{
		outputManager: outputManager,
		logger:        logger,
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

func (l *Listener) ListenOnConnection(conn *connections.OrganizerConnection) {
	defer func() {
		if r := recover(); r != nil {
			l.logger.Printf("error %v\n", r)
		}
	}()

	for {
		var request wsRequest
		err := conn.Ws.ReadJSON(&request)
		if err != nil {
			if os.IsTimeout(err) {
				l.logger.Printf("organizer %s timeout\n", conn.Ws.RemoteAddr())
				conn.Close()
				return
			}
			var closeError *websocket.CloseError
			if errors.As(err, &closeError) {
				l.logger.Printf("close error: %s\n", err)
				return
			}
			l.logger.Printf("unexpected error: %s\n", err)
		} else {
			conn.ResetReadTimer()
			l.logger.Printf("new message from organizer %s, payload: \"%s\"\n",
				conn.Ws.RemoteAddr(),
				request.Payload,
			)
			go l.handleTask(task{
				ChatId:        "63cf08b1d38a3682abc90575",
				Payload:       request.Payload,
				FromOrganizer: 1,
				AuthorId:      conn.Organizer.Id,
				TimeReceived:  time.Now(),
			})
		}
	}
}

func (l *Listener) handleTask(task task) {
	newMessage := &messages.Message{
		ChatId:        task.ChatId,
		Content:       task.Payload,
		FromOrganizer: task.FromOrganizer,
		AuthorId:      task.AuthorId,
		TimeSent:      task.TimeReceived,
	}
	err := l.outputManager.SendUserMessageInChat(task.ChatId, newMessage)
	if err != nil {
		l.logger.Println(err)
	}
}
