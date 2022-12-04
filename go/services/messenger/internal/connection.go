package internal

import (
	"fmt"
	"github.com/gorilla/websocket"
	"sync"
	"time"
)

const PingTimeout = 60 * time.Second

type ClientConnection struct {
	ws   *websocket.Conn
	mu   sync.Mutex
	open bool
}

func NewClientConnection(wsConnection *websocket.Conn) (*ClientConnection, error) {
	conn := &ClientConnection{
		ws:   wsConnection,
		mu:   sync.Mutex{},
		open: true,
	}
	err := conn.ws.SetReadDeadline(time.Now().Add(PingTimeout))
	if err != nil {
		return nil, err
	}
	return conn, nil
}

func (c *ClientConnection) ResetReadTimer() {
	err := c.ws.SetReadDeadline(time.Now().Add(PingTimeout))
	if err != nil {
		c.Close()
	}
}

func (c *ClientConnection) Close() {
	c.mu.Lock()
	c.ws.Close()
	c.open = false
	c.mu.Unlock()
	fmt.Printf("Client %s disconnected\n", c.ws.RemoteAddr())
}
