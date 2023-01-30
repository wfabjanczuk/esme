package chats

import (
	"errors"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"time"
)

var ErrChatInvalidId = errors.New("chat: invalid id")

type Chat struct {
	Id            string    `json:"id"`
	AgencyId      int32     `json:"agencyId"`
	EventId       int32     `json:"eventId"`
	OrganizerId   int32     `json:"organizerId"`
	ParticipantId int32     `json:"participantId"`
	Ended         int32     `json:"ended"`
	TimeStart     time.Time `json:"timeStart"`
	TimeEnd       time.Time `json:"timeEnd"`
}

type PrimitiveChat struct {
	Id            primitive.ObjectID `bson:"_id,omitempty"`
	AgencyId      int32              `bson:"agencyId"`
	EventId       int32              `bson:"eventId"`
	OrganizerId   int32              `bson:"organizerId"`
	ParticipantId int32              `bson:"participantId"`
	Ended         int32              `bson:"ended"`
	TimeStart     primitive.DateTime `bson:"timeStart"`
	TimeEnd       primitive.DateTime `bson:"timeEnd"`
}

func (c *Chat) Primitive() (*PrimitiveChat, error) {
	objectId, err := primitive.ObjectIDFromHex(c.Id)
	if err != nil && c.Id != "" {
		return nil, ErrChatInvalidId
	}

	return &PrimitiveChat{
		Id:            objectId,
		AgencyId:      c.AgencyId,
		EventId:       c.EventId,
		OrganizerId:   c.OrganizerId,
		ParticipantId: c.ParticipantId,
		Ended:         c.Ended,
		TimeStart:     primitive.NewDateTimeFromTime(c.TimeStart),
		TimeEnd:       primitive.NewDateTimeFromTime(c.TimeEnd),
	}, nil
}

func (p *PrimitiveChat) Chat() *Chat {
	return &Chat{
		Id:            p.Id.Hex(),
		AgencyId:      p.AgencyId,
		EventId:       p.EventId,
		OrganizerId:   p.OrganizerId,
		ParticipantId: p.ParticipantId,
		Ended:         p.Ended,
		TimeStart:     p.TimeStart.Time(),
		TimeEnd:       p.TimeEnd.Time(),
	}
}
