package internal

import (
	"log"
)

const (
	statusSuccess = "Success"
	statusError   = "Error"
)

type WSResponse struct {
	Message string `json:"message"`
	Status  string `json:"status"`
}

func sendErrorMessage(conn *ClientConnection, message string) {
	sendWSResponse(conn, WSResponse{
		Message: message,
		Status:  statusError,
	})
}

func sendSuccessMessage(conn *ClientConnection, message string) {
	sendWSResponse(conn, WSResponse{
		Message: message,
		Status:  statusSuccess,
	})
}

func sendWSResponse(conn *ClientConnection, response WSResponse) {
	if !conn.open {
		return
	}
	err := conn.ws.WriteJSON(response)
	if err != nil {
		log.Println("Websocket error: ", err)
		connectionsSet.Delete(conn)
		conn.Close()
	}
}
