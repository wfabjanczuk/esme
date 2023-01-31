package messages

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
		collection:   db.Collection("messages"),
		maxQueryTime: maxQueryTime,
	}
}

func (r *Repository) Create(message *Message) (*Message, error) {
	ctx, cancel := context.WithTimeout(context.Background(), r.maxQueryTime)
	defer cancel()

	primitiveMessage, _ := message.Primitive()
	result, err := r.collection.InsertOne(ctx, primitiveMessage)
	if err != nil {
		return nil, err
	}

	primitiveMessage.Id = result.InsertedID.(primitive.ObjectID)
	return primitiveMessage.Message(), err
}

func (r *Repository) FindAll(chatId string) ([]*Message, error) {
	ctx, cancel := context.WithTimeout(context.Background(), r.maxQueryTime)
	defer cancel()

	chatObjectId, err := primitive.ObjectIDFromHex(chatId)
	if err != nil {
		return nil, err
	}

	var messages []*Message
	cursor, err := r.collection.Find(ctx, bson.M{"chat": chatObjectId})

	defer cursor.Close(ctx)
	for cursor.Next(ctx) {
		var primitiveMessage PrimitiveMessage
		err = cursor.Decode(&primitiveMessage)
		if err != nil {
			return nil, err
		}
		messages = append(messages, primitiveMessage.Message())
	}
	if err != nil {
		return nil, err
	}

	return messages, nil
}

func (r *Repository) FindOne(id string) (*Message, error) {
	ctx, cancel := context.WithTimeout(context.Background(), r.maxQueryTime)
	defer cancel()

	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	var primitiveMessage PrimitiveMessage
	err = r.collection.FindOne(ctx, bson.M{"_id": objectId}).Decode(&primitiveMessage)
	if err != nil {
		return nil, err
	}

	return primitiveMessage.Message(), nil
}

func (r *Repository) Replace(message *Message) (*Message, error) {
	ctx, cancel := context.WithTimeout(context.Background(), r.maxQueryTime)
	defer cancel()

	primitiveMessage, err := message.Primitive()
	if err != nil {
		return nil, err
	}

	result, err := r.collection.ReplaceOne(ctx, bson.M{"_id": primitiveMessage.Id}, primitiveMessage)
	if err != nil {
		return nil, err
	}
	if result.ModifiedCount == 0 {
		return nil, errors.New("message not updated (not found)")
	}

	return message, nil
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
		return errors.New("message not deleted (not found)")
	}

	return nil
}
