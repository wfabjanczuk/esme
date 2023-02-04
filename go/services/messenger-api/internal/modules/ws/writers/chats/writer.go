package chats

import (
	"messenger-api/internal/modules/common"
	"messenger-api/internal/modules/infrastructure/messages"
	"messenger-api/internal/modules/ws/connections"
	"sync"
)

type chatChannel struct {
	ChatId                string
	OrganizerConnection   *connections.OrganizerConnection
	ParticipantConnection *connections.ParticipantConnection
}

type Writer struct {
	messagesRepository *messages.Repository
	chats              map[string]*chatChannel
	mu                 sync.RWMutex
}

func NewWriter(messagesRepository *messages.Repository) *Writer {
	return &Writer{
		messagesRepository: messagesRepository,
		chats:              make(map[string]*chatChannel),
		mu:                 sync.RWMutex{},
	}
}

func (w *Writer) getSetChat(chatId string) *chatChannel {
	c, exists := w.chats[chatId]
	if !exists {
		c = &chatChannel{
			ChatId: chatId,
		}
		w.chats[chatId] = c
	}
	return c
}

func (w *Writer) SetOrganizerInChat(chatId string, conn *connections.OrganizerConnection) {
	w.mu.Lock()
	defer w.mu.Unlock()

	w.getSetChat(chatId).OrganizerConnection = conn
	conn.AddChat(chatId)
}

func (w *Writer) SetParticipantInChat(chatId string, conn *connections.ParticipantConnection) {
	w.mu.Lock()
	defer w.mu.Unlock()

	w.getSetChat(chatId).ParticipantConnection = conn
}

func (w *Writer) RemoveOrganizerFromChat(chatId string) error {
	w.mu.Lock()
	defer w.mu.Unlock()

	c, exists := w.chats[chatId]
	if !exists {
		return common.ErrChatNotFound
	}

	if c.ParticipantConnection == nil {
		delete(w.chats, chatId)
		return nil
	}

	c.OrganizerConnection = nil
	return nil
}

func (w *Writer) RemoveParticipantFromChat(chatId string) error {
	w.mu.Lock()
	defer w.mu.Unlock()

	c, exists := w.chats[chatId]
	if !exists {
		return common.ErrChatNotFound
	}

	if c.OrganizerConnection == nil {
		delete(w.chats, chatId)
		return nil
	}

	c.ParticipantConnection = nil
	return nil
}
