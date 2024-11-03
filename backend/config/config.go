package config

import (
	"os"
)

type Config struct {
	DBConnection string
}

func LoadConfig() Config {
	// // load .env file
	// err := godotenv.Load()
	// if err != nil {
	// 	log.Fatal(err)
	// }

	return Config{
		DBConnection: os.Getenv("DATABASE_URL"),
	}
}
