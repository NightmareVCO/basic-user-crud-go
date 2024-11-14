package repositories

import (
	"database/sql"
	"fmt"

	"api/models"
)

type UserRepository interface {
	GetAllUsers(searchQuery string, teamID int) ([]models.User, error)
	GetUserByEmail(email string) (models.User, error)
	CreateUser(user models.User, teamID int) error
	UpdateUser(user models.User, id int, teamID int) (models.User, error)
	DeleteUser(id int, teamID int) error
	GetUserById(id int) (models.User, error)
}

type userRepo struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) UserRepository {
	return &userRepo{db}
}

func (r *userRepo) GetAllUsers(searchQuery string, teamID int) ([]models.User, error) {
	var rows *sql.Rows
	var err error

	if searchQuery != "" {
		query := `
			SELECT users.id, users.name, users.email, users.status
			FROM users
			INNER JOIN team_users ON users.id = team_users.user_id
			WHERE team_users.team_id = $1 AND users.status = true AND (users.name ILIKE $2 OR users.email ILIKE $2)
			ORDER BY users.id DESC`
		rows, err = r.db.Query(query, teamID, "%"+searchQuery+"%")
	} else {
		query := `
			SELECT users.id, users.name, users.email, users.status
			FROM users
			INNER JOIN team_users ON users.id = team_users.user_id
			WHERE team_users.team_id = $1 AND users.status = true
			ORDER BY users.id DESC`
		rows, err = r.db.Query(query, teamID)
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

func (r *userRepo) GetUserByEmail(email string) (models.User, error) {
	row := r.db.QueryRow("SELECT * FROM users WHERE email = $1", email)

	var user models.User
	if err := row.Scan(&user.Id, &user.Name, &user.Email, &user.Status); err != nil {
		return models.User{}, err
	}

	return user, nil
}

func (r *userRepo) CreateUser(user models.User, teamID int) error {
	err := r.db.QueryRow("INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id", user.Name, user.Email).Scan(&user.Id)
	if err != nil {
		return err
	}

	_, err = r.db.Exec("INSERT INTO team_users (team_id, user_id) VALUES ($1, $2)", teamID, user.Id)
	if err != nil {
		return err
	}

	return nil
}
func (r *userRepo) UpdateUser(user models.User, id int, teamID int) (models.User, error) {
	// Check if user is part of the team
	var userTeamID int
	err := r.db.QueryRow("SELECT team_id FROM team_users WHERE user_id = $1", id).Scan(&userTeamID)
	if err != nil {
		return models.User{}, fmt.Errorf("user is not part of the team: %w", err)
	}

	if userTeamID != teamID {
		return models.User{}, fmt.Errorf("user is not part of the team")
	}

	_, err = r.db.Exec("UPDATE users SET name = $1, email = $2 WHERE id = $3", user.Name, user.Email, id)
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

func (r *userRepo) DeleteUser(id int, teamID int) error {

	// Check if user is part of the team
	var userTeamID int
	err := r.db.QueryRow("SELECT team_id FROM team_users WHERE user_id = $1", id).Scan(&userTeamID)
	if err != nil {
		return fmt.Errorf("user is not part of the team: %w", err)
	}

	if userTeamID != teamID {
		return fmt.Errorf("user is not part of the team")
	}

	_, err = r.db.Exec("UPDATE users SET status = false WHERE id = $1", id)
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

func (r *userRepo) GetUserById(id int) (models.User, error) {
	row := r.db.QueryRow("SELECT * FROM users WHERE id = $1 AND status = true", id)

	var user models.User
	if err := row.Scan(&user.Id, &user.Name, &user.Email, &user.Status); err != nil {
		return models.User{}, err
	}

	return user, nil
}
