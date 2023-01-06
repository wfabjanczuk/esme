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

type UsersRepository struct {
	logger *log.Logger
	DB     *sql.DB
}

func NewUsersRepository(logger *log.Logger, db *sql.DB) *UsersRepository {
	return &UsersRepository{
		logger: logger,
		DB:     db,
	}
}

func (r *UsersRepository) GetUserByID(ID int) (*User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), maxQueryTime)
	defer cancel()

	user := &User{}

	query := `select u.id, u.email, u.password, u."phoneNumber", u."createdAt"
       from "user" u where u.id = $1`

	err := r.DB.QueryRowContext(ctx, query, ID).Scan(
		&user.ID, &user.Email, &user.Password, &user.PhoneNumber, &user.CreatedAt,
	)

	if err != nil {
		return user, err
	}
	return user, nil
}

func (r *UsersRepository) GetUserByEmail(email string) (*User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), maxQueryTime)
	defer cancel()

	user := &User{}

	query := `select u.id, u.email, u.password, u."phoneNumber", u."createdAt"
       from "user" u where u.email = $1`

	err := r.DB.QueryRowContext(ctx, query, email).Scan(
		&user.ID, &user.Email, &user.Password, &user.PhoneNumber, &user.CreatedAt,
	)

	if err != nil {
		return user, err
	}
	return user, nil
}

func (r *UsersRepository) InsertUser(dto SignUpDTO) (*User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), maxQueryTime)
	defer cancel()

	var insertedId int

	existingUser, err := r.GetUserByEmail(dto.Email)
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
		CreatedAt:   time.Now(),
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), 12)
	if err != nil {
		return nil, err
	}
	user.Password = string(hashedPassword)

	stmt := `insert into "user" (email, password, "phoneNumber", "createdAt")
values ($1, $2, $3, $4) returning id`

	err = r.DB.QueryRowContext(ctx, stmt, user.Email, user.Password, user.PhoneNumber, user.CreatedAt).Scan(&insertedId)

	user.ID = insertedId
	if err != nil {
		return nil, err
	}
	return user, nil
}
