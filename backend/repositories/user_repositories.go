package repositories

import (
	"database/sql"
	"fmt"

	"github.com/nightmareVCO/user-crud-go-nextjs/models"
)

type UserRepository interface {
	GetAllUsers(searchQuery string) ([]models.User, error)
	GetUserById(id int) (models.User, error)
	CreateUser(user models.User) error
	UpdateUser(user models.User, id int) (models.User, error)
	DeleteUser(id int) error
}

type userRepo struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) UserRepository {
	return &userRepo{db}
}

func (r *userRepo) GetAllUsers(searchQuery string) ([]models.User, error) {
	var rows *sql.Rows
	var err error

	if searchQuery != "" {
		query := "SELECT * FROM users WHERE status = true AND (name ILIKE $1 OR email ILIKE $1) ORDER BY id DESC"
		rows, err = r.db.Query(query, "%"+searchQuery+"%")
	} else {
		query := "SELECT * FROM users WHERE status = true ORDER BY id DESC"
		rows, err = r.db.Query(query)
	}

	if err != nil {
		return nil, fmt.Errorf("error executing query: %w", err)
	}
	defer rows.Close()

	var users []models.User
	for rows.Next() {
		var user models.User
		if err := rows.Scan(&user.Id, &user.Name, &user.Email, &user.Status); err != nil {
			return nil, fmt.Errorf("error scanning row: %w", err)
		}
		users = append(users, user)
	}

	return users, nil
}

func (r *userRepo) GetUserById(id int) (models.User, error) {
	row := r.db.QueryRow("SELECT * FROM users WHERE id = $1 AND status = true", id)

	var user models.User
	if err := row.Scan(&user.Id, &user.Name, &user.Email, &user.Status); err != nil {
		return models.User{}, err
	}

	return user, nil
}

func (r *userRepo) CreateUser(user models.User) error {
	err := r.db.QueryRow("INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id", user.Name, user.Email).Scan(&user.Id)

	return err
}

func (r *userRepo) UpdateUser(user models.User, id int) (models.User, error) {
	_, err := r.db.Exec("UPDATE users SET name = $1, email = $2 WHERE id = $3", user.Name, user.Email, id)
	if err != nil {
		return models.User{}, err
	}

	var updatedUser models.User
	err = r.db.QueryRow("SELECT * FROM users WHERE id = $1", id).Scan(&updatedUser.Id, &updatedUser.Name, &updatedUser.Email, &updatedUser.Status)
	if err != nil {
		return models.User{}, err
	}

	return updatedUser, nil
}

func (r *userRepo) DeleteUser(id int) error {
	_, err := r.db.Exec("UPDATE users SET status = false WHERE id = $1", id)
	if err != nil {
		return err
	}

	var updatedUser models.User
	err = r.db.QueryRow("SELECT * FROM users WHERE id = $1", id).Scan(&updatedUser.Id, &updatedUser.Name, &updatedUser.Email, &updatedUser.Status)
	if err != nil {
		return err
	}

	return err
}
