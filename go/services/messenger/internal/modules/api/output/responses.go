package output

import (
	"messenger/internal/modules/api/connections"
)

const (
	statusSuccess = "Success"
	statusError   = "Error"
)

type WSResponse struct {
	Message string `json:"message"`
	Status  string `json:"status"`
}

func sendErrorMessage(conn *connections.ClientConnection, message string) {
	sendWSResponse(conn, WSResponse{
		Message: message,
		Status:  statusError,
	})
}

func sendSuccessMessage(conn *connections.ClientConnection, message string) {
	sendWSResponse(conn, WSResponse{
		Message: message,
		Status:  statusSuccess,
	})
}

func sendWSResponse(conn *connections.ClientConnection, response WSResponse) {
	conn.WS.WriteJSON(response)
}
