package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"api/models"
	"api/repositories"

	"github.com/gorilla/mux"
)

type ProfileHandler struct {
	repo repositories.ProfileRepository
}

func NewProfileHandler(repo repositories.ProfileRepository) *ProfileHandler {
	return &ProfileHandler{repo}
}

func (h *ProfileHandler) RegisterProfileRoutes(r *mux.Router) {
	r.HandleFunc("/profiles", h.GetProfiles).Methods(http.MethodGet)
	r.HandleFunc("/profiles/{id}", h.GetProfile).Methods(http.MethodGet)
	r.HandleFunc("/profiles", h.CreateProfile).Methods(http.MethodPost)
	r.HandleFunc("/profiles/{id}", h.UpdateProfile).Methods(http.MethodPut)
	r.HandleFunc("/profiles/{id}", h.DeleteProfile).Methods(http.MethodDelete)
}

func (h *ProfileHandler) GetProfiles(w http.ResponseWriter, r *http.Request) {
	profiles, err := h.repo.GetAllProfiles(r.URL.Query().Get("search"))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(profiles)
}

func (h *ProfileHandler) GetProfile(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	profile, err := h.repo.GetProfileByEmail(vars["email"])
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(profile)
}

func (h *ProfileHandler) CreateProfile(w http.ResponseWriter, r *http.Request) {
	var profile models.Profile
	err := json.NewDecoder(r.Body).Decode(&profile)
	if err != nil {
		http.Error(w, "Datos inválidos", http.StatusBadRequest)
		return
	}

	profile, err = h.repo.CreateProfile(profile)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

func (h *ProfileHandler) UpdateProfile(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "ID inválido", http.StatusBadRequest)
		return
	}

	var profile models.Profile
	err = json.NewDecoder(r.Body).Decode(&profile)
	if err != nil {
		http.Error(w, "Datos inválidos", http.StatusBadRequest)
		return
	}

	profile, err = h.repo.UpdateProfile(profile, id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(profile)
}

func (h *ProfileHandler) DeleteProfile(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "ID inválido", http.StatusBadRequest)
		return
	}

	err = h.repo.DeleteProfile(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
