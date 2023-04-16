package participants

//func (c *Consumer) consumeSendMessage(conn *connections.ParticipantConnection, msg *protocol.Message) {
//	inPayload, err := in.ParseSendMessagePayload(msg)
//	if err != nil {
//		c.logger.Printf("%s sent invalid %s payload\n", conn.GetInfo(), msg.Type)
//		conn.SendError(common.ErrInvalidMessagePayload)
//		return
//	}
//
//	if !c.chatsManager.HasChatParticipant(inPayload.ChatId, conn) {
//		c.logger.Printf("%s has no access to chat %s\n", conn.GetInfo(), inPayload.ChatId)
//		conn.SendError(common.NewErrNoAccessToChat(inPayload.ChatId))
//		return
//	}
//
//	organizerMessage := &messages.Message{
//		ChatId:        inPayload.ChatId,
//		Content:       inPayload.Message,
//		FromOrganizer: 0,
//		AuthorId:      conn.Participant.Id,
//		TimeSent:      msg.TimeReceived,
//	}
//	err = c.chatsManager.SendChatMessage(inPayload.ChatId, organizerMessage)
//	if err != nil {
//		conn.SendError(err)
//		return
//	}
//}
