package connections

import (
	"fmt"
	"github.com/gorilla/websocket"
	"time"
)

const ReadTimeout = 60 * time.Second

type ClientConnection struct {
	WS *websocket.Conn
}

func NewClientConnection(wsConnection *websocket.Conn) (*ClientConnection, error) {
	conn := &ClientConnection{
		WS: wsConnection,
	}
	err := conn.WS.SetReadDeadline(time.Now().Add(ReadTimeout))
	if err != nil {
		return nil, err
	}
	return conn, nil
}

func (c *ClientConnection) ResetReadTimer() {
	err := c.WS.SetReadDeadline(time.Now().Add(ReadTimeout))
	if err != nil {
		c.Close()
	}
}

func (c *ClientConnection) Close() {
	c.WS.Close()
	fmt.Printf("Client %s disconnected\n", c.WS.RemoteAddr())
}
