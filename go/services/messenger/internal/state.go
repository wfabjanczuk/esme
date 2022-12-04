package internal

import (
	"github.com/gorilla/websocket"
	"net/http"
	"sync"
)

var connectionsSet = NewClientConnectionSet()
var requestQueue = make(chan *WSRequest)

var wsUpgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

type ClientConnectionSet struct {
	set map[*ClientConnection]struct{}
	mu  sync.RWMutex
}

func NewClientConnectionSet() *ClientConnectionSet {
	return &ClientConnectionSet{
		make(map[*ClientConnection]struct{}),
		sync.RWMutex{},
	}
}

func (s *ClientConnectionSet) Add(conn *ClientConnection) {
	s.mu.Lock()
	s.set[conn] = struct{}{}
	s.mu.Unlock()
}

func (s *ClientConnectionSet) Delete(conn *ClientConnection) {
	s.mu.Lock()
	delete(s.set, conn)
	s.mu.Unlock()
}

func (s *ClientConnectionSet) ForEach(callback func(conn *ClientConnection)) {
	s.mu.RLock()
	for conn := range s.set {
		callback(conn)
	}
	s.mu.RUnlock()
}
