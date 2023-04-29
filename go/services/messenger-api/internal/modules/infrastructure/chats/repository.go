package chats

import (
	"context"
	"errors"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"time"
)

type Repository struct {
	collection   *mongo.Collection
	maxQueryTime time.Duration
}

func NewRepository(db *mongo.Database, maxQueryTime time.Duration) *Repository {
	return &Repository{
		collection:   db.Collection("chats"),
		maxQueryTime: maxQueryTime,
	}
}

func (r *Repository) Create(chat *Chat) (*Chat, error) {
	ctx, cancel := context.WithTimeout(context.Background(), r.maxQueryTime)
	defer cancel()

	primitiveChat, _ := chat.Primitive()
	result, err := r.collection.InsertOne(ctx, primitiveChat)
	if err != nil {
		return nil, err
	}

	primitiveChat.Id = result.InsertedID.(primitive.ObjectID)
	return primitiveChat.Chat(), err
}

func (r *Repository) FindAllByAgencyId(agencyId int32) ([]*Chat, error) {
	ctx, cancel := context.WithTimeout(context.Background(), r.maxQueryTime)
	defer cancel()

	chats := make([]*Chat, 0)
	cursor, err := r.collection.Find(ctx, bson.M{"agencyId": agencyId})

	defer cursor.Close(ctx)
	for cursor.Next(ctx) {
		var primitiveChat PrimitiveChat
		err = cursor.Decode(&primitiveChat)
		if err != nil {
			return nil, err
		}
		chats = append(chats, primitiveChat.Chat())
	}
	if err != nil {
		return nil, err
	}

	return chats, nil
}

func (r *Repository) FindAllByOrganizerId(organizerId int32) ([]*Chat, error) {
	ctx, cancel := context.WithTimeout(context.Background(), r.maxQueryTime)
	defer cancel()

	chats := make([]*Chat, 0)
	cursor, err := r.collection.Find(ctx, bson.M{"organizerId": organizerId})

	defer cursor.Close(ctx)
	for cursor.Next(ctx) {
		var primitiveChat PrimitiveChat
		err = cursor.Decode(&primitiveChat)
		if err != nil {
			return nil, err
		}
		chats = append(chats, primitiveChat.Chat())
	}
	if err != nil {
		return nil, err
	}

	return chats, nil
}

func (r *Repository) FindAllByParticipantId(participantId int32) ([]*Chat, error) {
	ctx, cancel := context.WithTimeout(context.Background(), r.maxQueryTime)
	defer cancel()

	chats := make([]*Chat, 0)
	cursor, err := r.collection.Find(ctx, bson.M{"participantId": participantId})

	defer cursor.Close(ctx)
	for cursor.Next(ctx) {
		var primitiveChat PrimitiveChat
		err = cursor.Decode(&primitiveChat)
		if err != nil {
			return nil, err
		}
		chats = append(chats, primitiveChat.Chat())
	}
	if err != nil {
		return nil, err
	}

	return chats, nil
}

func (r *Repository) FindOneInAgency(chatId string, agencyId int32) (*Chat, error) {
	ctx, cancel := context.WithTimeout(context.Background(), r.maxQueryTime)
	defer cancel()

	objectId, err := primitive.ObjectIDFromHex(chatId)
	if err != nil {
		return nil, err
	}

	var primitiveChat PrimitiveChat
	err = r.collection.FindOne(ctx, bson.M{"_id": objectId, "agencyId": agencyId}).Decode(&primitiveChat)
	if err != nil {
		return nil, err
	}

	return primitiveChat.Chat(), nil
}

func (r *Repository) Replace(chat *Chat) (*Chat, error) {
	ctx, cancel := context.WithTimeout(context.Background(), r.maxQueryTime)
	defer cancel()

	primitiveChat, err := chat.Primitive()
	if err != nil {
		return nil, err
	}

	result, err := r.collection.ReplaceOne(ctx, bson.M{"_id": primitiveChat.Id}, primitiveChat)
	if err != nil {
		return nil, err
	}
	if result.ModifiedCount == 0 {
		return nil, errors.New("chat not updated (not found)")
	}

	return chat, nil
}

func (r *Repository) Delete(id string) error {
	ctx, cancel := context.WithTimeout(context.Background(), r.maxQueryTime)
	defer cancel()

	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	result, err := r.collection.DeleteOne(ctx, bson.M{"_id": objectId})
	if err != nil {
		return err
	}
	if result.DeletedCount == 0 {
		return errors.New("chat not deleted (not found)")
	}

	return nil
}
