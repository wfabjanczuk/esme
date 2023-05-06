package messages

import (
	"errors"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"time"
)

var ErrMessageInvalidId = errors.New("message: invalid id")
var ErrMessageInvalidChatId = errors.New("message: invalid chat id")

type Message struct {
	Id            string    `json:"id"`
	ChatId        string    `json:"chatId"`
	AuthorId      int32     `json:"authorId"`
	FromOrganizer int32     `json:"fromOrganizer"`
	Content       string    `json:"content"`
	TimeSent      time.Time `json:"timeSent"`
	Lat           *float64  `json:"lat,omitempty"`
	Lng           *float64  `json:"lng,omitempty"`
}

type PrimitiveMessage struct {
	Id            primitive.ObjectID `bson:"_id,omitempty"`
	ChatId        primitive.ObjectID `bson:"chat"`
	AuthorId      int32              `bson:"authorId"`
	FromOrganizer int32              `bson:"fromOrganizer"`
	Content       string             `bson:"content"`
	TimeSent      primitive.DateTime `bson:"timeSent"`
	Lat           *float64           `json:"lat,omitempty"`
	Lng           *float64           `json:"lng,omitempty"`
}

func (m *Message) Primitive() (*PrimitiveMessage, error) {
	chatObjectId, err := primitive.ObjectIDFromHex(m.ChatId)
	if err != nil {
		return nil, ErrMessageInvalidChatId
	}

	objectId, err := primitive.ObjectIDFromHex(m.Id)
	if err != nil && m.Id != "" {
		return nil, ErrMessageInvalidId
	}

	return &PrimitiveMessage{
		Id:            objectId,
		ChatId:        chatObjectId,
		AuthorId:      m.AuthorId,
		FromOrganizer: m.FromOrganizer,
		Content:       m.Content,
		TimeSent:      primitive.NewDateTimeFromTime(m.TimeSent),
		Lat:           m.Lat,
		Lng:           m.Lng,
	}, nil
}

func (p *PrimitiveMessage) Message() *Message {
	return &Message{
		Id:            p.Id.Hex(),
		ChatId:        p.ChatId.Hex(),
		AuthorId:      p.AuthorId,
		FromOrganizer: p.FromOrganizer,
		Content:       p.Content,
		TimeSent:      p.TimeSent.Time(),
		Lat:           p.Lat,
		Lng:           p.Lng,
	}
}
