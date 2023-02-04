package subscriptions

import (
	"context"
	"database/sql"
	"time"
)

type Repository struct {
	db           *sql.DB
	maxQueryTime time.Duration
}

func NewRepository(db *sql.DB, maxQueryTime time.Duration) *Repository {
	return &Repository{
		db:           db,
		maxQueryTime: maxQueryTime,
	}
}

func (r *Repository) FindSubscriptionsByUserId(userId int) ([]int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), r.maxQueryTime)
	defer cancel()

	query := `select s."eventId" from "subscription" s where s."userId" = $1`
	rows, err := r.db.QueryContext(ctx, query, userId)
	if err != nil {
		return nil, err
	}

	eventIds := make([]int, 0)
	for rows.Next() {
		var eventId int
		if err = rows.Scan(&eventId); err != nil {
			return nil, err
		}
		eventIds = append(eventIds, eventId)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}
	return eventIds, nil
}

func (r *Repository) Subscribe(userId int, eventId int) error {
	ctx, cancel := context.WithTimeout(context.Background(), r.maxQueryTime)
	defer cancel()

	stmt := `insert into "subscription" ("userId", "eventId") values ($1, $2) on conflict do nothing`
	_, err := r.db.ExecContext(ctx, stmt, userId, eventId)
	return err
}

func (r *Repository) Unsubscribe(userId int, eventId int) error {
	ctx, cancel := context.WithTimeout(context.Background(), r.maxQueryTime)
	defer cancel()

	stmt := `delete from "subscription" where "userId" = $1 and "eventId" = $2`
	_, err := r.db.ExecContext(ctx, stmt, userId, eventId)
	return err
}
