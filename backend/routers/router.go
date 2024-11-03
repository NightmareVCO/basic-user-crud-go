package routers

import (
	"api/handlers"

	"github.com/gorilla/mux"
)

func SetupRouter(userHandler *handlers.UserHandler) *mux.Router {
	router := mux.NewRouter()

	// Rutas de usuarios
	router.HandleFunc("/api/go/users", userHandler.GetUsers).Methods("GET")
	router.HandleFunc("/api/go/users", userHandler.CreateUser).Methods("POST")
	router.HandleFunc("/api/go/users/{id}", userHandler.GetUser).Methods("GET")
	router.HandleFunc("/api/go/users/{id}", userHandler.UpdateUser).Methods("PUT")
	router.HandleFunc("/api/go/users/{id}", userHandler.DeleteUser).Methods("DELETE")

	return router
}
