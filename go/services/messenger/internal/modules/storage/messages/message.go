package messages

import (
	"errors"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"time"
)

var ErrMessageInvalidId = errors.New("message: invalid id")
var ErrMessageInvalidChatId = errors.New("message: invalid chat id")

type Message struct {
	ID            string    `json:"id"`
	ChatID        string    `json:"chatId"`
	Content       string    `json:"content"`
	AuthorID      int32     `json:"authorId"`
	FromOrganizer int32     `json:"fromOrganizer"`
	TimeSent      time.Time `json:"timeSent"`
}

type PrimitiveMessage struct {
	ID            primitive.ObjectID `bson:"_id,omitempty"`
	ChatID        primitive.ObjectID `bson:"chat"`
	Content       string             `bson:"content"`
	AuthorID      int32              `bson:"authorId"`
	FromOrganizer int32              `bson:"fromOrganizer"`
	TimeSent      primitive.DateTime `bson:"timeSent"`
}

func (m *Message) Primitive() (*PrimitiveMessage, error) {
	chatObjectId, err := primitive.ObjectIDFromHex(m.ChatID)
	if err != nil {
		return nil, ErrMessageInvalidChatId
	}

	objectId, err := primitive.ObjectIDFromHex(m.ID)
	if err != nil && m.ID != "" {
		return nil, ErrMessageInvalidId
	}

	return &PrimitiveMessage{
		ID:            objectId,
		ChatID:        chatObjectId,
		Content:       m.Content,
		AuthorID:      m.AuthorID,
		FromOrganizer: m.FromOrganizer,
		TimeSent:      primitive.NewDateTimeFromTime(m.TimeSent),
	}, nil
}

func (p *PrimitiveMessage) Message() *Message {
	return &Message{
		ID:            p.ID.Hex(),
		ChatID:        p.ChatID.Hex(),
		Content:       p.Content,
		AuthorID:      p.AuthorID,
		FromOrganizer: p.FromOrganizer,
		TimeSent:      p.TimeSent.Time(),
	}
}
