package participants

import (
	"encoding/json"
	"time"
)

type signUpRequestDTO struct {
	Email           string `json:"email"`
	Password        string `json:"password"`
	ConfirmPassword string `json:"confirmPassword"`
	PhoneNumber     string `json:"phoneNumber"`
}

type signUpResponseDTO struct {
	User  user   `json:"user"`
	Token string `json:"token"`
}

type user struct {
	Id          int       `json:"id"`
	Email       string    `json:"email"`
	PhoneNumber string    `json:"phoneNumber"`
	TimeCreated time.Time `json:"timeCreated"`
	TimeSignOut time.Time `json:"timeSignOut"`
}

type createChatRequestDto struct {
	EventId     int    `json:"eventId"`
	Description string `json:"description"`
}

type wsAuthorizationDto struct {
	Authorization string `json:"Authorization"`
}

type wsGetChatsDto struct {
	Type    string `json:"type"`
	Payload string `json:"payload"`
}

type wsSendMessageDto struct {
	Type    string               `json:"type"`
	Payload wsSendMessagePayload `json:"payload"`
}

type wsSendMessagePayload struct {
	ChatId  string `json:"chatId"`
	Message string `json:"message"`
}

type wsResponseDto struct {
	Type    string          `json:"type"`
	Payload json.RawMessage `json:"payload"`
}

type wsChatsResponsePayload struct {
	Chats []chat `json:"chats"`
}

type chat struct {
	Id string `json:"id"`
}

type wsUserMessageResponsePayload struct {
	FromOrganizer int32  `json:"fromOrganizer"`
	Content       string `json:"content"`
}
