package main

import (
	"log"
	"net/http"

	"api/db"
	"api/routers"

	"api/config"

	"api/middlewares"

	"api/repositories"

	"api/handlers"

	_ "github.com/lib/pq"
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
	teamRepo := repositories.NewTeamRepository(database)
	profileRepo := repositories.NewProfileRepository(database)

	userHandler := handlers.NewUserHandler(userRepo, teamRepo, profileRepo)
	profileHandler := handlers.NewProfileHandler(profileRepo)
	authHandler := handlers.NewAuthHandler(profileRepo, teamRepo)

	handlers := routers.Handlers{
		UserHandler:    userHandler,
		ProfileHandler: profileHandler,
		AuthHandler:    authHandler,
	}

	router := routers.SetupRouter(handlers)
	enhancedRouter := middlewares.AuthorizationMiddleware(
		middlewares.EnableCORS(
			middlewares.JsonContentTypeMiddleware(router),
		),
	)

	// start the server
	log.Println("Server is running on port 8080")
	log.Fatal(http.ListenAndServe(":8000", enhancedRouter))
}
