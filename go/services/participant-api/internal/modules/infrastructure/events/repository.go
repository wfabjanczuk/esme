package events

import (
	"context"
	"database/sql"
	"fmt"
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

func (r *Repository) GetEventById(Id int) (*Event, error) {
	ctx, cancel := context.WithTimeout(context.Background(), r.maxQueryTime)
	defer cancel()

	event := &Event{}

	query := `select e.id, e.name, e.description, e.address, e.lat, e.lng, e."timeStart", e."timeEnd"
       from "event" e where e.id = $1`

	err := r.db.QueryRowContext(ctx, query, Id).Scan(
		&event.Id, &event.Name, &event.Description, &event.Address, &event.Lat, &event.Lng, &event.TimeStart,
		&event.TimeEnd,
	)

	if err != nil {
		return nil, err
	}
	return event, nil
}

type Filters struct {
	Name        string
	Description string
	Address     string
	TimeStart   time.Time
	TimeEnd     time.Time
}

func (f Filters) isEmpty() bool {
	return f.Name == "" && f.Description == "" && f.Address == "" && f.TimeStart.IsZero() && f.TimeEnd.IsZero()
}

func (f Filters) buildWhereClause() string {
	if f.isEmpty() {
		return ""
	}

	var conditions []string
	if f.Name != "" {
		conditions = append(conditions, fmt.Sprintf(`e.name ilike '%%%s%%' `, f.Name))
	}
	if f.Description != "" {
		conditions = append(conditions, fmt.Sprintf(`e.description ilike '%%%s%%' `, f.Description))
	}
	if f.Address != "" {
		conditions = append(conditions, fmt.Sprintf(`e.address ilike '%%%s%%' `, f.Address))
	}
	if !f.TimeStart.IsZero() {
		conditions = append(conditions, fmt.Sprintf(`e."timeStart" >= '%s' `, f.TimeStart.Format(time.RFC3339)))
	}
	if !f.TimeEnd.IsZero() {
		conditions = append(conditions, fmt.Sprintf(`e."timeEnd" <= '%s' `, f.TimeEnd.Format(time.RFC3339)))
	}

	where := "where "
	for i, c := range conditions {
		where += c
		if i < len(conditions)-1 {
			where += "and "
		}
	}

	return where
}

func (r *Repository) FindEvents(filters Filters, limit int) ([]*Event, error) {
	ctx, cancel := context.WithTimeout(context.Background(), r.maxQueryTime)
	defer cancel()

	query := `select e.id, e.name, e.description, e.address, e.lat, e.lng, e."timeStart", e."timeEnd"
       from "event" e ` + filters.buildWhereClause() + fmt.Sprintf(`limit %d`, limit)

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}

	var events []*Event
	for rows.Next() {
		event := &Event{}
		err = rows.Scan(
			&event.Id, &event.Name, &event.Description, &event.Address, &event.Lat, &event.Lng, &event.TimeStart,
			&event.TimeEnd,
		)
		if err != nil {
			return nil, err
		}

		events = append(events, event)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}
	return events, nil
}
