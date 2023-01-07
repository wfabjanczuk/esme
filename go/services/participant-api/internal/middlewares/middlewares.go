package middlewares

import (
	"net/http"
)

type paramsUserKey struct{}

var ParamsUserKey = paramsUserKey{}

type EnableCors struct {
	Handler http.Handler
}

func (m EnableCors) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, PATCH, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type,Authorization")
	m.Handler.ServeHTTP(w, r)
}
