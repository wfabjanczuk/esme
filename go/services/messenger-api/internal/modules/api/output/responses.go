package output

import (
	"github.com/gorilla/websocket"
)

const (
	statusSuccess = "Success"
	statusError   = "Error"
)

type WSResponse struct {
	Message string `json:"message"`
	Status  string `json:"status"`
}

func sendErrorMessage(ws *websocket.Conn, message string) {
	sendWSResponse(ws, WSResponse{
		Message: message,
		Status:  statusError,
	})
}

func sendSuccessMessage(ws *websocket.Conn, message string) {
	sendWSResponse(ws, WSResponse{
		Message: message,
		Status:  statusSuccess,
	})
}

func sendWSResponse(ws *websocket.Conn, response WSResponse) {
	ws.WriteJSON(response)
}
