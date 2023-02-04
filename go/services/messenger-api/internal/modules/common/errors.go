package common

import (
	"errors"
	"fmt"
)

var (
	ErrInternal         = errors.New("internal server error")
	ErrTimeout          = errors.New("timeout")
	ErrConnectionExists = errors.New("connection already exists")

	ErrMalformedMessage      = errors.New("malformed message")
	ErrInvalidMessageType    = errors.New("invalid message type")
	ErrInvalidMessagePayload = errors.New("invalid message payload")

	ErrChatNotFoundMessageSaved = errors.New("message saved but chat not found")
	ErrMessageNotSaved          = errors.New("message could not be saved")

	ErrChatNotCreated = errors.New("chat could not be created")
	ErrChatNotFound   = errors.New("chat not found")

	ErrMessagesNotFetchedFromDb       = errors.New("could not get messages")
	ErrChatRequestNotFetchedFromQueue = errors.New("could not get chat from queue")
	ErrChatsNotFetchedFromDb          = errors.New("could not get chats")
	ErrChatNotConnected               = errors.New("could not connect to chat")
)

func NewErrNoAccessToChat(chatId string) error {
	return fmt.Errorf("you have no access to chat %s", chatId)
}
