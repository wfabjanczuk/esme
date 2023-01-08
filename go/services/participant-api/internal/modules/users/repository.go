package users

import (
	"context"
	"database/sql"
	"errors"
	"golang.org/x/crypto/bcrypt"
	"log"
	"time"
)

const maxQueryTime = 3 * time.Second

type usersRepository struct {
	logger *log.Logger
	db     *sql.DB
}

func newUsersRepository(logger *log.Logger, db *sql.DB) *usersRepository {
	return &usersRepository{
		logger: logger,
		db:     db,
	}
}

func (r *usersRepository) getUserByID(ID int) (*User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), maxQueryTime)
	defer cancel()

	user := &User{}

	query := `select u.id, u.email, u.password, u."phoneNumber", u."timeCreated", u."timeSignOut"
       from "user" u where u.id = $1`

	err := r.db.QueryRowContext(ctx, query, ID).Scan(
		&user.ID, &user.Email, &user.Password, &user.PhoneNumber, &user.TimeCreated, &user.TimeSignOut,
	)

	if err != nil {
		return user, err
	}
	return user, nil
}

func (r *usersRepository) getUserByEmail(email string) (*User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), maxQueryTime)
	defer cancel()

	user := &User{}

	query := `select u.id, u.email, u.password, u."phoneNumber", u."timeCreated", u."timeSignOut"
       from "user" u where u.email = $1`

	err := r.db.QueryRowContext(ctx, query, email).Scan(
		&user.ID, &user.Email, &user.Password, &user.PhoneNumber, &user.TimeCreated, &user.TimeSignOut,
	)

	if err != nil {
		return user, err
	}
	return user, nil
}

func (r *usersRepository) insertUser(dto *signUpDTO) (*User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), maxQueryTime)
	defer cancel()

	var insertedId int

	existingUser, err := r.getUserByEmail(dto.Email)
	if err != nil && err != sql.ErrNoRows {
		log.Println(err)
		return nil, err
	}
	if existingUser.ID > 0 {
		return nil, errors.New("email already exists")
	}

	user := &User{
		Email:       dto.Email,
		Password:    dto.Password,
		PhoneNumber: dto.PhoneNumber,
		TimeCreated: time.Now(),
		TimeSignOut: time.Now(),
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), 12)
	if err != nil {
		return nil, err
	}
	user.Password = string(hashedPassword)

	stmt := `insert into "user" (email, password, "phoneNumber", "timeCreated", "timeSignOut")
values ($1, $2, $3, $4, $5) returning id`

	err = r.db.QueryRowContext(ctx, stmt,
		user.Email,
		user.Password,
		user.PhoneNumber,
		user.TimeCreated,
		user.TimeSignOut,
	).Scan(&insertedId)

	user.ID = insertedId
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (r *usersRepository) updateUser(user *User) error {
	ctx, cancel := context.WithTimeout(context.Background(), maxQueryTime)
	defer cancel()

	stmt := `update "user" set "phoneNumber" = $1, "timeSignOut" = $2 where id = $3`

	_, err := r.db.ExecContext(ctx, stmt, user.PhoneNumber, user.TimeSignOut, user.ID)
	if err != nil {
		return err
	}
	return nil
}

func (r *usersRepository) signOut(user *User) error {
	ctx, cancel := context.WithTimeout(context.Background(), maxQueryTime)
	defer cancel()

	user.TimeSignOut = time.Now()
	stmt := `update "user" set "timeSignOut" = $1 where id = $2`

	_, err := r.db.ExecContext(ctx, stmt, user.TimeSignOut, user.ID)
	if err != nil {
		return err
	}
	return nil
}

func (r *usersRepository) changePassword(user *User) error {
	ctx, cancel := context.WithTimeout(context.Background(), maxQueryTime)
	defer cancel()

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), 12)
	if err != nil {
		return err
	}
	user.Password = string(hashedPassword)
	user.TimeSignOut = time.Now()

	stmt := `update "user" set password = $1, "timeSignOut" = $2 where id = $3`

	_, err = r.db.ExecContext(ctx, stmt, user.Password, user.TimeSignOut, user.ID)
	if err != nil {
		return err
	}
	return nil
}
