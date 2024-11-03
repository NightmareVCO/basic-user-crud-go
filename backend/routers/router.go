package routers

import (
	"github.com/gorilla/mux"
	"github.com/nightmareVCO/user-crud-go-nextjs/handlers"
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
