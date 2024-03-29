package common

import (
	"errors"
	"fmt"
)

var (
	ErrUnexpected = errors.New("unexpected error")
	ErrInternal   = errors.New("internal server error")
	ErrTimeout    = errors.New("timeout")

	ErrMalformedMessage      = errors.New("malformed message")
	ErrInvalidMessageType    = errors.New("invalid message type")
	ErrInvalidMessagePayload = errors.New("invalid message payload")
	ErrMessageNotSaved       = errors.New("message could not be saved")

	ErrChatNotCreated = errors.New("chat could not be created")
	ErrChatNotFound   = errors.New("chat not found")
	ErrChatNotClosed  = errors.New("chat could not be closed")

	ErrMessagesNotFetchedFromDb       = errors.New("could not get messages")
	ErrChatRequestNotFetchedFromQueue = errors.New("could not get chat from queue")
	ErrChatsNotFetchedFromDb          = errors.New("could not get chats")

	ErrConnectionPoolClosing = errors.New("connection pool is in closing state")
)

func NewErrNoAccessToChat(chatId string) error {
	return fmt.Errorf("you have no access to chat %s", chatId)
}
