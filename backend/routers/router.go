package routers

import (
	"api/handlers"

	"github.com/gorilla/mux"
)

type Handlers struct {
	UserHandler    *handlers.UserHandler
	ProfileHandler *handlers.ProfileHandler
	AuthHandler    *handlers.AuthHandler
}

func SetupRouter(h Handlers) *mux.Router {
	router := mux.NewRouter()
	api := router.PathPrefix("/api/go").Subrouter()

	h.UserHandler.RegisterUserRoutes(api)
	h.ProfileHandler.RegisterProfileRoutes(api)
	h.AuthHandler.RegisterAuthRoutes(api)

	return router
}
