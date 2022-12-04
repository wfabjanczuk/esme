package internal

import (
	"fmt"
	"log"
	"net/http"
	"os"
)

func InitConnection(w http.ResponseWriter, r *http.Request) {
	wsConnection, err := wsUpgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	fmt.Printf("Client %s connected\n", wsConnection.RemoteAddr())

	conn, err := NewClientConnection(wsConnection)
	if err != nil {
		return
	}

	connectionsSet.Add(conn)
	sendSuccessMessage(conn, "Connected to the server")
	go listenOnClientConnection(conn)
}

func listenOnClientConnection(conn *ClientConnection) {
	defer func() {
		if r := recover(); r != nil {
			log.Println("Error", fmt.Sprintf("%v", r))
		}
	}()

	for {
		if !conn.open {
			return
		}
		var payload WSPayload
		err := conn.ws.ReadJSON(&payload)
		if err != nil {
			if os.IsTimeout(err) {
				fmt.Printf("Client %s timeout\n", conn.ws.RemoteAddr())
				conn.Close()
				return
			}
			sendErrorMessage(conn, "Invalid JSON payload")
		} else {
			conn.ResetReadTimer()
			fmt.Printf("New message from client %s, action: \"%s\", message: \"%s\"\n",
				conn.ws.RemoteAddr(),
				payload.Action,
				payload.Message,
			)
			wsRequest, err := NewWSRequest(payload, conn)
			if err != nil {
				sendErrorMessage(conn, err.Error())
			} else {
				requestQueue <- wsRequest
			}
		}
	}
}

func ListenOnRequestQueue() {
	for {
		wsRequest := <-requestQueue
		payload := wsRequest.Payload

		switch payload.Action {
		case "broadcast":
			connectionsSet.ForEach(func(conn *ClientConnection) {
				sendSuccessMessage(conn, payload.Message)
			})
		}
	}
}
