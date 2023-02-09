package ws

import (
	"fmt"
	"github.com/gorilla/websocket"
	"messenger-api/internal/modules/common"
	"messenger-api/internal/modules/ws/connections"
	"net/http"
)

func (c *Controller) connectParticipant(r *http.Request, wsConnection *websocket.Conn, token string) {
	participant, err := c.authenticator.AuthenticateParticipant(token)
	if err != nil {
		c.logger.Printf("could not authenticate participant %s: %s\n", r.RemoteAddr, err)
		wsConnection.Close()
		return
	}

	conn, err := connections.NewParticipantConnection(participant, wsConnection, c.logger)
	if err != nil {
		c.logger.Printf("could not set up participant connection %s: %s\n", r.RemoteAddr, err)
		wsConnection.Close()
		return
	}
	c.logger.Printf("%s opened connection\n", conn.GetInfo())

	chats, err := c.chatsRepository.FindAllByParticipantId(participant.Id)
	if err != nil {
		c.logger.Printf("could not fetch participant chats %s: %s\n", r.RemoteAddr, err)
		conn.SendError(common.ErrChatsNotFetchedFromDb)
		conn.Close()
		return
	}

	for _, chat := range chats {
		err = c.out.SetChatParticipant(chat.Id, conn)
		if err != nil {
			c.logger.Printf("%s could not connect to chats: %s\n", conn.GetInfo(), err)
			conn.SendError(err)
			c.out.DisconnectParticipant(conn)
			conn.Close()
			return
		}
	}

	conn.SendInfo(fmt.Sprintf("%s successfully connected", conn.GetInfo()))
	go c.participantsConsumer.ListenOnConnection(conn)
}
