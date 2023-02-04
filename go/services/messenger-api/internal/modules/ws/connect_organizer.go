package ws

import (
	"messenger-api/internal/modules/ws/connections"
	"net/http"
)

func (c *Controller) connectOrganizer(w http.ResponseWriter, r *http.Request, token string) {
	organizer, err := c.authenticator.AuthenticateOrganizer(token)
	if err != nil {
		c.logger.Printf("could not authenticate organizer %s: %s\n", r.RemoteAddr, err)
		return
	}

	wsConnection, err := wsUpgrader.Upgrade(w, r, nil)
	if err != nil {
		c.logger.Printf("could not upgrade organizer connection %s: %s\n", r.RemoteAddr, err)
		return
	}

	conn, err := connections.NewOrganizerConnection(wsConnection, organizer, c.logger)
	if err != nil {
		c.logger.Printf("could not set up organizer connection %s: %s\n", r.RemoteAddr, err)
		wsConnection.Close()
		return
	}
	c.logger.Printf("%s opened connection\n", conn.GetInfo())

	chats, err := c.chatsRepository.FindAllByOrganizerId(organizer.Id)
	if err != nil {
		c.logger.Printf("%s could not fetch chats: %s\n", conn.GetInfo(), err)
		conn.Close()
		return
	}

	for _, chat := range chats {
		conn.AddChat(chat.Id)
		c.out.SetOrganizerInChat(chat.Id, conn)
	}

	go c.organizersConsumer.ListenOnConnection(conn)
}
