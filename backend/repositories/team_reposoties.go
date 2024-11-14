package repositories

import (
	"database/sql"

	"api/models"
)

type TeamRepository interface {
	GetAllTeams(searchQuery string) ([]models.Team, error)
	GetTeamById(id int) (models.Team, error)
	GetTeamByOwnerProfileID(id int) (models.Team, error)
	CreateTeam(team models.Team) error
	UpdateTeam(team models.Team, id int) (models.Team, error)
	DeleteTeam(id int) error
}

type teamRepo struct {
	db *sql.DB
}

func NewTeamRepository(db *sql.DB) TeamRepository {
	return &teamRepo{db}
}

func (r *teamRepo) GetAllTeams(searchQuery string) ([]models.Team, error) {
	var rows *sql.Rows
	var err error

	if searchQuery != "" {
		query := "SELECT * FROM teams WHERE name ILIKE $1 ORDER BY id DESC"
		rows, err = r.db.Query(query, "%"+searchQuery+"%")
	} else {
		query := "SELECT * FROM teams ORDER BY id DESC"
		rows, err = r.db.Query(query)
	}

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var teams []models.Team
	for rows.Next() {
		var team models.Team
		if err := rows.Scan(&team.Id, &team.Name, &team.OwnerProfile); err != nil {
			return nil, err
		}
		teams = append(teams, team)
	}

	return teams, nil
}

func (r *teamRepo) GetTeamByOwnerProfileID(id int) (models.Team, error) {
	row := r.db.QueryRow("SELECT * FROM teams WHERE profile_owner = $1", id)

	var team models.Team
	if err := row.Scan(&team.Id, &team.Name, &team.OwnerProfile); err != nil {
		return models.Team{}, err
	}

	return team, nil
}

func (r *teamRepo) GetTeamById(id int) (models.Team, error) {
	row := r.db.QueryRow("SELECT * FROM teams WHERE id = $1", id)

	var team models.Team
	if err := row.Scan(&team.Id, &team.Name, &team.OwnerProfile); err != nil {
		return models.Team{}, err
	}

	return team, nil
}

func (r *teamRepo) CreateTeam(team models.Team) error {
	_, err := r.db.Exec("INSERT INTO teams (name, profile_owner) VALUES ($1, $2)", team.Name, team.OwnerProfile)
	return err
}

func (r *teamRepo) UpdateTeam(team models.Team, id int) (models.Team, error) {
	_, err := r.db.Exec("UPDATE teams SET name = $1, profile_owner = $2 WHERE id = $3", team.Name, team.OwnerProfile, id)
	return team, err
}

func (r *teamRepo) DeleteTeam(id int) error {
	_, err := r.db.Exec("DELETE FROM teams WHERE id = $1", id)
	return err
}
