package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"api/middlewares" // Import the middlewares package
	"api/models"
	"api/repositories"

	"github.com/gorilla/mux"
)

type UserHandler struct {
	Repo        repositories.UserRepository
	TeamRepo    repositories.TeamRepository
	ProfileRepo repositories.ProfileRepository
}

func NewUserHandler(repo repositories.UserRepository, teamRepo repositories.TeamRepository, profileRepo repositories.ProfileRepository) *UserHandler {
	return &UserHandler{Repo: repo, TeamRepo: teamRepo, ProfileRepo: profileRepo}
}

func (h *UserHandler) RegisterUserRoutes(r *mux.Router) {
	r.Handle("/users", middlewares.BeforeAuthorizationMiddlware(http.HandlerFunc(h.GetUsers))).Methods(http.MethodGet)
	r.Handle("/users", middlewares.BeforeAuthorizationMiddlware(http.HandlerFunc(h.CreateUser))).Methods(http.MethodPost)
	r.Handle("/users/{id}", middlewares.BeforeAuthorizationMiddlware(http.HandlerFunc(h.UpdateUser))).Methods(http.MethodPut)
	r.Handle("/users/{id}", middlewares.BeforeAuthorizationMiddlware(http.HandlerFunc(h.DeleteUser))).Methods(http.MethodDelete)
	r.HandleFunc("/users/{id}", h.GetUser).Methods(http.MethodGet)
}

func (h *UserHandler) GetUsers(w http.ResponseWriter, r *http.Request) {
	profileID := r.Context().Value("profileID").(int)
	if profileID == 0 {
		http.Error(w, "ID de perfil no encontrado", http.StatusUnauthorized)
		return
	}

	queryParams := r.URL.Query()
	query := queryParams.Get("q")

	teamID, err := h.TeamRepo.GetTeamByOwnerProfileID(profileID)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error al obtener el equipo: %s", err), http.StatusInternalServerError)
		return
	}

	users, err := h.Repo.GetAllUsers(query, teamID.Id)
	if err != nil {
		http.Error(w, fmt.Sprint("Error al obtener los usuario: ", err), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(users)
}

func (h *UserHandler) CreateUser(w http.ResponseWriter, r *http.Request) {
	profileID := r.Context().Value("profileID").(int)

	teamID, err := h.TeamRepo.GetTeamByOwnerProfileID(profileID)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error al obtener el equipo: %s", err), http.StatusInternalServerError)
		return
	}

	var user models.User
	err = json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, "Datos inválidos", http.StatusBadRequest)
		return
	}

	err = h.Repo.CreateUser(user, teamID.Id)
	if err != nil {
		http.Error(w, "Error al crear usuario", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(user)
}

func (h *UserHandler) UpdateUser(w http.ResponseWriter, r *http.Request) {
	profileID := r.Context().Value("profileID").(int)

	teamID, err := h.TeamRepo.GetTeamByOwnerProfileID(profileID)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error al obtener el equipo: %s", err), http.StatusInternalServerError)
		return
	}

	var user models.User
	err = json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, "Datos inválidos", http.StatusBadRequest)
		return
	}

	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "ID inválido", http.StatusBadRequest)
		return
	}

	user, err = h.Repo.UpdateUser(user, id, teamID.Id)
	if err != nil {
		http.Error(w, "Error al actualizar usuario", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(user)
}

func (h *UserHandler) DeleteUser(w http.ResponseWriter, r *http.Request) {
	profileID := r.Context().Value("profileID").(int)

	teamID, err := h.TeamRepo.GetTeamByOwnerProfileID(profileID)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error al obtener el equipo: %s", err), http.StatusInternalServerError)
		return
	}

	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "ID inválido", http.StatusBadRequest)
		return
	}

	err = h.Repo.DeleteUser(id, teamID.Id)
	if err != nil {
		http.Error(w, "Error al eliminar usuario", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *UserHandler) GetUser(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "ID inválido", http.StatusBadRequest)
		return
	}

	user, err := h.Repo.GetUserById(id)
	if err != nil {
		http.Error(w, fmt.Sprintf("Usuario no encontrado %s", err), http.StatusNotFound)
		return
	}
	json.NewEncoder(w).Encode(user)
}
