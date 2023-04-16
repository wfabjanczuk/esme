package participants

//func (c *Consumer) consumeGetChatHistory(conn *connections.ParticipantConnection, msg *protocol.Message) {
//	inPayload, err := in.ParseGetChatHistoryPayload(msg)
//	if err != nil {
//		c.logger.Printf("%s sent invalid %s payload\n", conn.GetInfo(), msg.Type)
//		conn.SendError(common.ErrInvalidMessagePayload)
//		return
//	}
//
//	chatMessages, err := c.messagesRepository.FindAll(inPayload.ChatId)
//	if err != nil {
//		c.logger.Printf("%s could not fetch chat %s messages: %s\n", conn.GetInfo(), inPayload.ChatId, err)
//		conn.SendError(common.ErrMessagesNotFetchedFromDb)
//		return
//	}
//
//	outMsg, err := out.BuildChatHistory(inPayload.ChatId, chatMessages)
//	if err != nil {
//		c.logger.Printf("could not send %s to %s: %s\n", out.MsgTypeChatHistory, conn.GetInfo(), err)
//		conn.SendError(common.ErrInternal)
//		return
//	}
//
//	conn.Send(outMsg)
//}
