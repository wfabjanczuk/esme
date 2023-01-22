package scratches

import (
	"context"
	"errors"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"time"
)

type Object interface {
	GetID() primitive.ObjectID
	SetID(primitive.ObjectID)
}

type Mapper[O Object] struct {
	collection   *mongo.Collection
	objectType   string
	maxQueryTime time.Duration
}

func NewMapper[O Object](db *mongo.Database, objectType string, maxQueryTime time.Duration) *Mapper[O] {
	return &Mapper[O]{
		collection:   db.Collection(objectType),
		objectType:   objectType,
		maxQueryTime: maxQueryTime,
	}
}

func (m *Mapper[O]) Create(object O) (O, error) {
	ctx, cancel := context.WithTimeout(context.Background(), m.maxQueryTime)
	defer cancel()

	result, err := m.collection.InsertOne(ctx, object)
	if err != nil {
		return object, err
	}

	object.SetID(result.InsertedID.(primitive.ObjectID))
	return object, nil
}

func (m *Mapper[O]) ReadAll() ([]O, error) {
	ctx, cancel := context.WithTimeout(context.Background(), m.maxQueryTime)
	defer cancel()

	var objects []O
	cursor, err := m.collection.Find(ctx, bson.M{})

	defer cursor.Close(ctx)
	for cursor.Next(ctx) {
		var object O
		err = cursor.Decode(&object)
		if err != nil {
			return nil, err
		}
		objects = append(objects, object)
	}
	if err != nil {
		return nil, err
	}

	return objects, nil
}

func (m *Mapper[O]) ReadOne(id primitive.ObjectID) (O, error) {
	ctx, cancel := context.WithTimeout(context.Background(), m.maxQueryTime)
	defer cancel()

	var object O
	err := m.collection.FindOne(ctx, bson.M{"_id": id}).Decode(&object)
	if err != nil {
		return object, err
	}

	return object, nil
}

func (m *Mapper[O]) Update(object O) error {
	ctx, cancel := context.WithTimeout(context.Background(), m.maxQueryTime)
	defer cancel()

	result, err := m.collection.ReplaceOne(ctx, bson.M{"_id": object.GetID()}, object)
	if err != nil {
		return err
	}
	if result.ModifiedCount == 0 {
		return errors.New(m.objectType + " not updated (not found)")
	}

	return nil
}

func (m *Mapper[O]) Delete(id primitive.ObjectID) error {
	ctx, cancel := context.WithTimeout(context.Background(), m.maxQueryTime)
	defer cancel()

	result, err := m.collection.DeleteOne(ctx, bson.M{"_id": id})
	if err != nil {
		return err
	}
	if result.DeletedCount == 0 {
		return errors.New(m.objectType + " not deleted (not found)")
	}

	return nil
}
