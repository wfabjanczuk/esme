package chats

import (
	"errors"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"time"
)

var ErrChatInvalidId = errors.New("chat: invalid id")

type Chat struct {
	ID          string    `json:"id"`
	Agency      int32     `json:"agency"`
	Event       int32     `json:"event"`
	Organizer   int32     `json:"organizer"`
	Participant int32     `json:"participant"`
	Ended       int32     `json:"ended"`
	TimeStart   time.Time `json:"timeStart"`
	TimeEnd     time.Time `json:"timeEnd"`
}

type PrimitiveChat struct {
	ID          primitive.ObjectID `bson:"_id,omitempty"`
	Agency      int32              `bson:"agency"`
	Event       int32              `bson:"event"`
	Organizer   int32              `bson:"organizer"`
	Participant int32              `bson:"participant"`
	Ended       int32              `bson:"ended"`
	TimeStart   primitive.DateTime `bson:"timeStart"`
	TimeEnd     primitive.DateTime `bson:"timeEnd"`
}

func (c *Chat) Primitive() (*PrimitiveChat, error) {
	objectId, err := primitive.ObjectIDFromHex(c.ID)
	if err != nil && c.ID != "" {
		return nil, ErrChatInvalidId
	}

	return &PrimitiveChat{
		ID:          objectId,
		Agency:      c.Agency,
		Event:       c.Event,
		Organizer:   c.Organizer,
		Participant: c.Participant,
		Ended:       c.Ended,
		TimeStart:   primitive.NewDateTimeFromTime(c.TimeStart),
		TimeEnd:     primitive.NewDateTimeFromTime(c.TimeEnd),
	}, nil
}

func (p *PrimitiveChat) Chat() *Chat {
	return &Chat{
		ID:          p.ID.Hex(),
		Agency:      p.Agency,
		Event:       p.Event,
		Organizer:   p.Organizer,
		Participant: p.Participant,
		Ended:       p.Ended,
		TimeStart:   p.TimeStart.Time(),
		TimeEnd:     p.TimeEnd.Time(),
	}
}

type ChatEntity struct {
	ID          primitive.ObjectID `bson:"_id,omitempty"`
	Agency      int32              `bson:"agency"`
	Event       int32              `bson:"event"`
	Organizer   int32              `bson:"organizer"`
	Participant int32              `bson:"participant"`
	Ended       int32              `bson:"ended"`
	TimeStart   primitive.DateTime `bson:"timeStart"`
	TimeEnd     primitive.DateTime `bson:"timeEnd"`
}

func (c *ChatEntity) GetID() primitive.ObjectID {
	return c.ID
}

func (c *ChatEntity) SetID(id primitive.ObjectID) {
	c.ID = id
}
