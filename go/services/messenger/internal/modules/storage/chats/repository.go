package chats

import (
	"context"
	"errors"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"time"
)

type ChatsRepository struct {
	collection   *mongo.Collection
	maxQueryTime time.Duration
}

func NewChatsRepository(db *mongo.Database, maxQueryTime time.Duration) *ChatsRepository {
	return &ChatsRepository{
		collection:   db.Collection("chats"),
		maxQueryTime: maxQueryTime,
	}
}

func (r *ChatsRepository) Create(chat *Chat) (*Chat, error) {
	ctx, cancel := context.WithTimeout(context.Background(), r.maxQueryTime)
	defer cancel()

	primitiveChat, _ := chat.Primitive()
	result, err := r.collection.InsertOne(ctx, primitiveChat)
	if err != nil {
		return nil, err
	}

	primitiveChat.ID = result.InsertedID.(primitive.ObjectID)
	return primitiveChat.Chat(), err
}

func (r *ChatsRepository) FindAll() ([]*Chat, error) {
	ctx, cancel := context.WithTimeout(context.Background(), r.maxQueryTime)
	defer cancel()

	var chats []*Chat
	cursor, err := r.collection.Find(ctx, bson.M{})

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

func (r *ChatsRepository) FindOne(id string) (*Chat, error) {
	ctx, cancel := context.WithTimeout(context.Background(), r.maxQueryTime)
	defer cancel()

	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	var primitiveChat PrimitiveChat
	err = r.collection.FindOne(ctx, bson.M{"_id": objectId}).Decode(&primitiveChat)
	if err != nil {
		return nil, err
	}

	return primitiveChat.Chat(), nil
}

func (r *ChatsRepository) Replace(chat *Chat) (*Chat, error) {
	ctx, cancel := context.WithTimeout(context.Background(), r.maxQueryTime)
	defer cancel()

	primitiveChat, err := chat.Primitive()
	if err != nil {
		return nil, err
	}

	result, err := r.collection.ReplaceOne(ctx, bson.M{"_id": primitiveChat.ID}, primitiveChat)
	if err != nil {
		return nil, err
	}
	if result.ModifiedCount == 0 {
		return nil, errors.New("chat not updated (not found)")
	}

	return chat, nil
}

func (r *ChatsRepository) Delete(id string) error {
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
