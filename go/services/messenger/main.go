package main

import (
	"esme/services/messenger/internal"
	"log"
	"net/http"
)

func main() {
	log.Println("Starting requests queue listener")
	go internal.ListenOnRequestQueue()

	http.HandleFunc("/ws", internal.InitConnection)
	log.Println("Starting server on port 3000")
	log.Fatal(http.ListenAndServe(":3000", nil))
}
