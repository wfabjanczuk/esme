package api

import (
	"github.com/julienschmidt/httprouter"
	"log"
	"messenger/internal/modules/api/input"
	"messenger/internal/modules/api/output"
	"messenger/internal/modules/storage"
	"messenger/internal/modules/storage/chats"
	"messenger/internal/modules/storage/messages"
	"net/http"
	"time"
)

type Module struct {
	chatsRepository    *chats.ChatsRepository
	messagesRepository *messages.MessagesRepository
}

func NewModule(logger *log.Logger, storageModule *storage.Module, router *httprouter.Router) *Module {
	module := &Module{
		chatsRepository:    storageModule.ChatsRepository,
		messagesRepository: storageModule.MessagesRepository,
	}
	outputManager := output.NewManager(storageModule.MessagesRepository)
	inputManager := input.NewManager(storageModule.ChatsRepository, outputManager, logger)

	chat := module.testChatsModule()
	module.testMessagesModule(chat)

	router.HandlerFunc(http.MethodGet, "/ws", inputManager.InitConnection)
	return module
}

func (m *Module) testChatsModule() *chats.Chat {
	chatsRepository := m.chatsRepository

	newChat := &chats.Chat{
		Agency:      1,
		Event:       1,
		Organizer:   1,
		Participant: 1,
		Ended:       0,
		TimeStart:   time.Now(),
		TimeEnd:     time.Time{},
	}
	chat, err := chatsRepository.Create(newChat)
	if err != nil {
		log.Fatal("Create chat error:", err)
	}
	log.Println("Created chat:", chat)

	chats, err := chatsRepository.FindAll()
	if err != nil {
		log.Fatal("Find all chats error:", err)
	}
	for _, c := range chats {
		log.Println("Found chat:", c)
	}

	chat, err = chatsRepository.FindOne(chats[len(chats)-1].ID)
	if err != nil {
		log.Fatal("Find one chat error:", err)
	}
	log.Println(chat)
	chat.Ended = 1
	chat.TimeEnd = time.Now()

	_, err = chatsRepository.Replace(chat)
	if err != nil {
		log.Fatal("Update chat error:", err)
	}
	log.Println(chat)

	return chat
}

func (m *Module) testMessagesModule(chat *chats.Chat) {
	chatsRepository := m.chatsRepository
	messagesRepository := m.messagesRepository

	newMessage := &messages.Message{
		ChatID:        chat.ID,
		Content:       "Hello, how can I help you?",
		FromOrganizer: 1,
		AuthorID:      1,
		TimeSent:      time.Now(),
	}
	message, err := messagesRepository.Create(newMessage)
	if err != nil {
		log.Fatal("Create message error:", err)
	}
	log.Println("Created message:", message)

	messages, err := messagesRepository.FindAll(chat.ID)
	if err != nil {
		log.Fatal("Find all messages error:", err)
	}
	for _, msg := range messages {
		log.Println("Found message:", msg)
	}

	message, err = messagesRepository.FindOne(messages[len(messages)-1].ID)
	if err != nil {
		log.Fatal("Find one message error:", err)
	}
	log.Println(message)
	message.Content = "Hello world"

	_, err = messagesRepository.Replace(message)
	if err != nil {
		log.Fatal("Update message error:", err)
	}
	log.Println(message)

	err = messagesRepository.Delete(message.ID)
	if err != nil {
		log.Fatal("Delete message error:", err)
	}

	err = chatsRepository.Delete(chat.ID)
	if err != nil {
		log.Fatal("Delete chat error:", err)
	}
}
