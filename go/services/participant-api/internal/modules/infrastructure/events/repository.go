package events

import (
	"context"
	"database/sql"
	"fmt"
	"strings"
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

func (f Filters) parseTextSearchFilter(field, value string, argId int) (condition, arg string) {
	condition = fmt.Sprintf("e.%s ilike '%%' || $%d || '%%'", field, argId)
	arg = strings.ReplaceAll(value, "%", `\%`)
	return
}

func (f Filters) buildWhereClause() (string, []any) {
	if f.isEmpty() {
		return "", nil
	}

	var conditions []string
	var args []any
	if f.Name != "" {
		c, a := f.parseTextSearchFilter("name", f.Name, len(args)+1)
		conditions = append(conditions, c)
		args = append(args, a)
	}
	if f.Description != "" {
		c, a := f.parseTextSearchFilter("description", f.Description, len(args)+1)
		conditions = append(conditions, c)
		args = append(args, a)
	}
	if f.Address != "" {
		c, a := f.parseTextSearchFilter("address", f.Address, len(args)+1)
		conditions = append(conditions, c)
		args = append(args, a)
	}
	if !f.TimeStart.IsZero() {
		c := fmt.Sprintf(`e."timeStart" >= $%d`, len(args)+1)
		conditions = append(conditions, c)
		args = append(args, f.TimeStart)
	}
	if !f.TimeEnd.IsZero() {
		c := fmt.Sprintf(`e."timeEnd" <= $%d`, len(args)+1)
		conditions = append(conditions, c)
		args = append(args, f.TimeEnd)
	}

	whereClause := "where " + strings.Join(conditions, " and ")
	return whereClause, args
}

func (r *Repository) FindEvents(filters Filters, limit int) ([]*Event, error) {
	ctx, cancel := context.WithTimeout(context.Background(), r.maxQueryTime)
	defer cancel()

	selectClause := `select e.id, e.name, e.description, e.address, e.lat, e.lng, e."timeStart", e."timeEnd" from "event" e`
	whereClause, args := filters.buildWhereClause()
	orderByClause := `order by e."timeStart" asc`
	limitClause := fmt.Sprintf(`limit %d`, limit)

	query := strings.Join([]string{selectClause, whereClause, orderByClause, limitClause}, " ")
	rows, err := r.db.QueryContext(ctx, query, args...)
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
