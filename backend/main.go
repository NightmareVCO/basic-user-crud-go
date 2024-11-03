package main

import (
	"log"
	"net/http"

	_ "github.com/lib/pq"
	"github.com/nightmareVCO/user-crud-go-nextjs/config"
	"github.com/nightmareVCO/user-crud-go-nextjs/db"
	"github.com/nightmareVCO/user-crud-go-nextjs/handlers"
	"github.com/nightmareVCO/user-crud-go-nextjs/middlewares"
	"github.com/nightmareVCO/user-crud-go-nextjs/repositories"
	"github.com/nightmareVCO/user-crud-go-nextjs/routers"
)

type User struct {
	Id    int    `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
}

// docker exec -it db psql -U postgres
// main function
func main() {
	// Cargar configuración
	cfg := config.LoadConfig()
	database := db.Connect(cfg)
	defer database.Close()

	userRepo := repositories.NewUserRepository(database)
	userHandler := handlers.NewUserHandler(userRepo)

	router := routers.SetupRouter(userHandler)
	enhancedRouter := middlewares.EnableCORS(middlewares.JsonContentTypeMiddleware(router))

	// start the server
	log.Fatal(http.ListenAndServe(":8000", enhancedRouter))
}
