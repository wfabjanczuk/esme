package users

import (
	"context"
	"database/sql"
	"golang.org/x/crypto/bcrypt"
	"participant-api/internal/modules/api/common/responses"
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

func (r *Repository) GetUserById(id int) (*User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), r.maxQueryTime)
	defer cancel()

	user := &User{}

	query := `select u.id, u.email, u.password, u."phoneNumber", u."timeCreated", u."timeSignOut"
       from "user" u where u.id = $1`

	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&user.Id, &user.Email, &user.Password, &user.PhoneNumber, &user.TimeCreated, &user.TimeSignOut,
	)

	if err != nil {
		return nil, err
	}
	return user, nil
}

func (r *Repository) GetUserByEmail(email string) (*User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), r.maxQueryTime)
	defer cancel()

	user := &User{}

	query := `select u.id, u.email, u.password, u."phoneNumber", u."timeCreated", u."timeSignOut"
       from "user" u where u.email = $1`

	err := r.db.QueryRowContext(ctx, query, email).Scan(
		&user.Id, &user.Email, &user.Password, &user.PhoneNumber, &user.TimeCreated, &user.TimeSignOut,
	)

	if err != nil {
		return nil, err
	}
	return user, nil
}

func (r *Repository) InsertUser(user *User) (*User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), r.maxQueryTime)
	defer cancel()

	var insertedId int

	_, err := r.GetUserByEmail(user.Email)
	if err == nil {
		return nil, responses.ErrEmailExists
	}
	if err != sql.ErrNoRows {
		return nil, err
	}

	now := time.Now()
	user.TimeCreated = now
	user.TimeSignOut = now

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), 12)
	if err != nil {
		return nil, err
	}
	user.Password = string(hashedPassword)

	stmt := `insert into "user" (email, password, "phoneNumber", "timeCreated", "timeSignOut")
values ($1, $2, $3, $4, $5) returning id`

	err = r.db.QueryRowContext(
		ctx, stmt,
		user.Email,
		user.Password,
		user.PhoneNumber,
		user.TimeCreated,
		user.TimeSignOut,
	).Scan(&insertedId)

	user.Id = insertedId
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (r *Repository) UpdateUser(user *User) error {
	ctx, cancel := context.WithTimeout(context.Background(), r.maxQueryTime)
	defer cancel()

	stmt := `update "user" set "phoneNumber" = $1, "timeSignOut" = $2 where id = $3`

	_, err := r.db.ExecContext(ctx, stmt, user.PhoneNumber, user.TimeSignOut, user.Id)
	if err != nil {
		return err
	}
	return nil
}

func (r *Repository) SignOut(user *User) error {
	ctx, cancel := context.WithTimeout(context.Background(), r.maxQueryTime)
	defer cancel()

	user.TimeSignOut = time.Now()
	stmt := `update "user" set "timeSignOut" = $1 where id = $2`

	_, err := r.db.ExecContext(ctx, stmt, user.TimeSignOut, user.Id)
	if err != nil {
		return err
	}
	return nil
}

func (r *Repository) ChangePassword(user *User) error {
	ctx, cancel := context.WithTimeout(context.Background(), r.maxQueryTime)
	defer cancel()

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), 12)
	if err != nil {
		return err
	}
	user.Password = string(hashedPassword)
	user.TimeSignOut = time.Now()

	stmt := `update "user" set password = $1, "timeSignOut" = $2 where id = $3`

	_, err = r.db.ExecContext(ctx, stmt, user.Password, user.TimeSignOut, user.Id)
	if err != nil {
		return err
	}
	return nil
}

func (r *Repository) DeleteUser(id int) error {
	ctx, cancel := context.WithTimeout(context.Background(), r.maxQueryTime)
	defer cancel()

	stmt := `delete from "user" where id = $1`

	_, err := r.db.ExecContext(ctx, stmt, id)
	if err != nil {
		return err
	}
	return nil
}
