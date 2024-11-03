package db

import (
	"database/sql"
	"log"

	"api/config"
)

type Database struct {
	DBConnection string
}

func Connect(cfg config.Config) *sql.DB {
	db, err := sql.Open("postgres", cfg.DBConnection)
	if err != nil {
		log.Fatal("Error al conectar con la base de datos:", err)
	}

	_, err = db.Exec("CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name TEXT, email TEXT, status BOOLEAN DEFAULT TRUE)")
	if err != nil {
		log.Fatal("Error al crear la tabla de usuarios:", err)
	}

	err = db.Ping()
	if err != nil {
		log.Fatal("No se pudo establecer conexión con la base de datos:", err)
	}

	return db
}
