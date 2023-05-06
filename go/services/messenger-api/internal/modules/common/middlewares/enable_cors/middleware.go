package enable_cors

import (
	"net/http"
)

type Middleware struct {
	handler http.Handler
}

func (m *Middleware) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type,Authorization")
	m.handler.ServeHTTP(w, r)
}

func (m *Middleware) Handler(handler http.Handler) http.Handler {
	return &Middleware{
		handler: handler,
	}
}
