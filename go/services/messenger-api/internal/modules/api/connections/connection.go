package connections

import (
	"github.com/gorilla/websocket"
	"log"
	"messenger-api/internal/modules/api/users"
	"time"
)

const ReadTimeout = 30 * time.Minute

type OrganizerConnection struct {
	Ws        *websocket.Conn
	Organizer *users.Organizer
	ChatIds   []string
	logger    *log.Logger
}

type ParticipantConnection struct {
	Ws          *websocket.Conn
	Participant *users.Participant
	ChatIds     []string
	logger      *log.Logger
}

func NewOrganizerConnection(wsConnection *websocket.Conn, organizer *users.Organizer, logger *log.Logger) (*OrganizerConnection, error) {
	conn := &OrganizerConnection{
		Ws:        wsConnection,
		Organizer: organizer,
		logger:    logger,
	}
	err := conn.Ws.SetReadDeadline(time.Now().Add(ReadTimeout))
	if err != nil {
		return nil, err
	}
	return conn, nil
}

func (c *OrganizerConnection) ResetReadTimer() {
	err := c.Ws.SetReadDeadline(time.Now().Add(ReadTimeout))
	if err != nil {
		c.Close()
	}
}

func (c *OrganizerConnection) Close() {
	c.Ws.Close()
	c.logger.Printf("closed connection for organizer %s\n", c.Ws.RemoteAddr())
}

func NewParticipantConnection(wsConnection *websocket.Conn, participant *users.Participant, logger *log.Logger) (*ParticipantConnection, error) {
	conn := &ParticipantConnection{
		Ws:          wsConnection,
		Participant: participant,
		logger:      logger,
	}
	err := conn.Ws.SetReadDeadline(time.Now().Add(ReadTimeout))
	if err != nil {
		return nil, err
	}
	return conn, nil
}

func (c *ParticipantConnection) ResetReadTimer() {
	err := c.Ws.SetReadDeadline(time.Now().Add(ReadTimeout))
	if err != nil {
		c.Close()
	}
}

func (c *ParticipantConnection) Close() {
	c.Ws.Close()
	c.logger.Printf("closed connection for participant %s\n", c.Ws.RemoteAddr())
}
