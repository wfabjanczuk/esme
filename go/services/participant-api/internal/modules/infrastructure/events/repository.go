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

func (r *Repository) GetEventById(id int) (*Event, error) {
	ctx, cancel := context.WithTimeout(context.Background(), r.maxQueryTime)
	defer cancel()

	event := &Event{}

	query := `select e.id, e.name, e.description, e.address, e.lat, e.lng, e."timeStart", e."timeEnd", e."agencyId"
       from "event" e where e.id = $1`

	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&event.Id, &event.Name, &event.Description, &event.Address, &event.Lat, &event.Lng, &event.TimeStart,
		&event.TimeEnd, &event.AgencyId,
	)

	if err != nil {
		return nil, err
	}
	return event, nil
}

type Filters struct {
	Query string
	From  time.Time
	To    time.Time
}

func (f Filters) isEmpty() bool {
	return f.Query == "" && f.From.IsZero() && f.To.IsZero()
}

func (f Filters) parseQueryFilter(value string, columns []string, argId int) (condition, arg string) {
	var subConditions []string
	for _, column := range columns {
		subCondition := fmt.Sprintf("e.%s ilike '%%' || $%d || '%%'", column, argId)
		subConditions = append(subConditions, subCondition)
	}
	condition = "(" + strings.Join(subConditions, " or ") + ")"
	arg = strings.ReplaceAll(value, "%", `\%`)
	return
}

func (f Filters) buildWhereClause() (string, []any) {
	if f.isEmpty() {
		return "", nil
	}

	var conditions []string
	var args []any

	if f.Query != "" {
		textSearchColumns := []string{"name", "description", "address"}
		c, a := f.parseQueryFilter(f.Query, textSearchColumns, len(args)+1)
		conditions = append(conditions, c)
		args = append(args, a)
	}
	if !f.From.IsZero() {
		c := fmt.Sprintf(`e."timeStart" >= $%d`, len(args)+1)
		conditions = append(conditions, c)
		args = append(args, f.From)
	}
	if !f.To.IsZero() {
		c := fmt.Sprintf(`e."timeStart" <= $%d`, len(args)+1)
		conditions = append(conditions, c)
		args = append(args, f.To)
	}

	whereClause := "where " + strings.Join(conditions, " and ")
	return whereClause, args
}

func (r *Repository) FindEvents(filters Filters, limit int) ([]*Event, error) {
	ctx, cancel := context.WithTimeout(context.Background(), r.maxQueryTime)
	defer cancel()

	selectClause := `select e.id, e.name, e.description, e.address, e.lat, e.lng, e."timeStart", e."timeEnd",
       e."agencyId" from "event" e`
	whereClause, args := filters.buildWhereClause()
	orderByClause := `order by e."timeStart" asc`
	limitClause := fmt.Sprintf(`limit %d`, limit)

	query := strings.Join([]string{selectClause, whereClause, orderByClause, limitClause}, " ")
	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, err
	}

	events := make([]*Event, 0)
	for rows.Next() {
		event := &Event{}
		err = rows.Scan(
			&event.Id, &event.Name, &event.Description, &event.Address, &event.Lat, &event.Lng, &event.TimeStart,
			&event.TimeEnd, &event.AgencyId,
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
