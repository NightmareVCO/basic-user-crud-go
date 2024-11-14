package db

import (
	"database/sql"
	"log"
	"os"

	"api/config"
	"api/utils"
)

type Database struct {
	DBConnection string
}

func Connect(cfg config.Config) *sql.DB {
	db, err := sql.Open("postgres", cfg.DBConnection)
	if err != nil {
		log.Fatal("Error al conectar con la base de datos:", err)
	}

	// users
	_, err = db.Exec("CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name TEXT, email TEXT, status BOOLEAN DEFAULT TRUE)")
	if err != nil {
		log.Fatal("Error al crear la tabla de usuarios:", err)
	}
	// inserting admin user if not exists
	_, err = db.Exec("INSERT INTO users (name, email) SELECT 'admin', 'admin@admin' WHERE NOT EXISTS (SELECT 1 FROM users WHERE name = 'admin')")
	if err != nil {
		log.Fatal("Error al insertar el usuario administrador:", err)
	}
	// creating normal user if not exists
	_, err = db.Exec("INSERT INTO users (name, email) SELECT 'user', 'user@user' WHERE NOT EXISTS (SELECT 1 FROM users WHERE name = 'user')")
	if err != nil {
		log.Fatal("Error al insertar el usuario normal:", err)
	}

	// profiles
	_, err = db.Exec("CREATE TABLE IF NOT EXISTS profiles (id SERIAL PRIMARY KEY, user_email TEXT UNIQUE, password TEXT)")
	if err != nil {
		log.Fatal("Error al crear la tabla de perfiles:", err)
	}

	// index por email
	_, err = db.Exec(`CREATE INDEX IF NOT EXISTS idx_user_email ON profiles(user_email)`)
	if err != nil {
		log.Fatal("Error al crear el índice de user_email:", err)
	}

	password := []byte("admin")
	hashedPassword, err := utils.Encrypt(password, os.Getenv("ENCRYPTION_KEY"))
	if err != nil {
		log.Fatal("Error al encriptar la contraseña:", err)
	}

	// inserting admin profile if not exists
	_, err = db.Exec("INSERT INTO profiles (user_email, password) SELECT 'admin@admin.com', $1 WHERE NOT EXISTS (SELECT 1 FROM profiles WHERE user_email = 'admin@admin.com')", hashedPassword)
	if err != nil {
		log.Fatal("Error al insertar el perfil administrador:", err)
	}

	// teams
	_, err = db.Exec("CREATE TABLE IF NOT EXISTS teams (id SERIAL PRIMARY KEY, name TEXT, profile_owner INTEGER)")
	if err != nil {
		log.Fatal("Error al crear la tabla de equipos:", err)
	}

	// inserting admin team if not exists
	_, err = db.Exec("INSERT INTO teams (name, profile_owner) SELECT 'admin', id FROM users WHERE name = 'admin' AND NOT EXISTS (SELECT 1 FROM teams WHERE profile_owner = (SELECT id FROM users WHERE name = 'admin'))")
	if err != nil {
		log.Fatal("Error al insertar el equipo administrador:", err)
	}

	// teams_users
	_, err = db.Exec("CREATE TABLE IF NOT EXISTS team_users (id SERIAL PRIMARY KEY, team_id INTEGER, user_id INTEGER)")
	if err != nil {
		log.Fatal("Error al crear la tabla de usuarios de equipos:", err)
	}

	// inserting normal profile into admin team_users if not exists
	_, err = db.Exec("INSERT INTO team_users (team_id, user_id) SELECT (SELECT id FROM teams WHERE name = 'admin'), id FROM users WHERE name = 'user' AND NOT EXISTS (SELECT 1 FROM team_users WHERE user_id = (SELECT id FROM users WHERE name = 'user'))")
	if err != nil {
		log.Fatal("Error al insertar el usuario normal en el equipo administrador:", err)
	}

	err = db.Ping()
	if err != nil {
		log.Fatal("No se pudo establecer conexión con la base de datos:", err)
	}

	return db
}
