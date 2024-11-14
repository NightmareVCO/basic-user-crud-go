package repositories

import (
	"database/sql"
	"log"
	"os"

	"api/models"
	"api/utils"
)

type ProfileRepository interface {
	GetAllProfiles(searchQuery string) ([]models.Profile, error)
	GetProfileByEmail(email string) (models.Profile, error)
	ComparePassword(email, password string) (bool, error)
	CreateProfile(profile models.Profile) (models.Profile, error)
	UpdateProfile(profile models.Profile, id int) (models.Profile, error)
	DeleteProfile(id int) error
}

type profileRepo struct {
	db *sql.DB
}

func NewProfileRepository(db *sql.DB) ProfileRepository {
	return &profileRepo{db}
}

func (r *profileRepo) GetAllProfiles(searchQuery string) ([]models.Profile, error) {
	var rows *sql.Rows
	var err error

	if searchQuery != "" {
		query := "SELECT * FROM profiles WHERE name ILIKE $1 ORDER BY id DESC"
		rows, err = r.db.Query(query, "%"+searchQuery+"%")
	} else {
		query := "SELECT * FROM profiles ORDER BY id DESC"
		rows, err = r.db.Query(query)
	}

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var profiles []models.Profile
	for rows.Next() {
		var profile models.Profile
		if err := rows.Scan(&profile.Id, &profile.Email, &profile.Password); err != nil {
			return nil, err
		}
		profiles = append(profiles, profile)
	}

	return profiles, nil
}

func (r *profileRepo) GetProfileByEmail(email string) (models.Profile, error) {
	row := r.db.QueryRow("SELECT * FROM profiles WHERE user_email = $1", email)

	var profile models.Profile
	if err := row.Scan(&profile.Id, &profile.Email, &profile.Password); err != nil {
		return models.Profile{}, err
	}

	return profile, nil
}

func (r *profileRepo) ComparePassword(email, password string) (bool, error) {

	//get user by email
	row := r.db.QueryRow("SELECT * FROM profiles WHERE user_email = $1", email)

	var profile models.Profile
	if err := row.Scan(&profile.Id, &profile.Email, &profile.Password); err != nil {
		return false, err
	}

	decryptedPassword, err := utils.Decrypt(profile.Password, os.Getenv("ENCRYPTION_KEY"))
	if err != nil {
		return false, err
	}

	// compare passwords
	if string(decryptedPassword) != password {
		return false, nil
	}

	return true, nil
}

func (r *profileRepo) CreateProfile(profile models.Profile) (models.Profile, error) {
	password := []byte(profile.Password)
	hashedPassword, err := utils.Encrypt(password, os.Getenv("ENCRYPTION_KEY"))
	if err != nil {
		log.Fatal("Error al encriptar la contraseña:", err)
	}

	profile.Password = string(hashedPassword)

	_, err = r.db.Exec("INSERT INTO profiles (user_email, password) VALUES ($1, $2)", profile.Email, profile.Password)
	if err != nil {
		return models.Profile{}, err
	}

	return profile, nil
}

func (r *profileRepo) UpdateProfile(profile models.Profile, id int) (models.Profile, error) {
	_, err := r.db.Exec("UPDATE profiles SET user_email = $1, password = $2 WHERE id = $3", profile.Email, profile.Password, id)
	if err != nil {
		return models.Profile{}, err
	}

	return profile, nil
}

func (r *profileRepo) DeleteProfile(id int) error {
	_, err := r.db.Exec("DELETE FROM profiles WHERE id = $1", id)
	if err != nil {
		return err
	}

	return nil
}
