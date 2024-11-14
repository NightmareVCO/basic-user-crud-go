package handlers

import (
	"api/models"
	"api/repositories"
	"api/utils"
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
)

type AuthHandler struct {
	ProfileRepo repositories.ProfileRepository
	TeamRepo    repositories.TeamRepository
}

func NewAuthHandler(ProfileRepo repositories.ProfileRepository, TeamRepo repositories.TeamRepository) *AuthHandler {
	return &AuthHandler{ProfileRepo: ProfileRepo, TeamRepo: TeamRepo}
}

func (h *AuthHandler) RegisterAuthRoutes(r *mux.Router) {
	r.HandleFunc("/auth/login", h.Login).Methods(http.MethodPost)
	r.HandleFunc("/auth/register", h.Register).Methods(http.MethodPost)
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var loginData struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	// decode the request body
	err := json.NewDecoder(r.Body).Decode(&loginData)
	if err != nil {
		http.Error(w, "Datos inválidos", http.StatusBadRequest)
		return
	}

	// get the profile by email
	profile, err := h.ProfileRepo.GetProfileByEmail(loginData.Email)
	if err != nil {
		http.Error(w, "Usuario no encontrado", http.StatusNotFound)
		return
	}

	// compare passwords
	match, err := h.ProfileRepo.ComparePassword(loginData.Email, loginData.Password)
	if err != nil {
		http.Error(w, "Error al comparar contraseñas", http.StatusInternalServerError)
		return
	}

	if !match {
		http.Error(w, "Contraseña incorrecta", http.StatusUnauthorized)
		return
	}

	// generate token
	token, err := utils.GenerateJWT((profile.Id))
	if err != nil {
		http.Error(w, "Error al generar token", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(token)
}

func (h *AuthHandler) Register(w http.ResponseWriter, r *http.Request) {
	var registerData struct {
		Name     string `json:"name"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	// decode the request body
	err := json.NewDecoder(r.Body).Decode(&registerData)
	if err != nil {
		http.Error(w, "Datos inválidos", http.StatusBadRequest)
		return
	}

	// check if the email is already registered
	_, err = h.ProfileRepo.GetProfileByEmail(registerData.Email)
	if err == nil {
		http.Error(w, "Email ya registrado", http.StatusConflict)
		return
	}

	// create a profile
	profile := models.Profile{
		Email:    registerData.Email,
		Password: registerData.Password,
	}

	_, err = h.ProfileRepo.CreateProfile(profile)
	if err != nil {
		http.Error(w, "Error al crear perfil", http.StatusInternalServerError)
		return
	}

	createdProfile, err := h.ProfileRepo.GetProfileByEmail(profile.Email)
	if err != nil {
		http.Error(w, "Error al obtener perfil", http.StatusInternalServerError)
		return
	}

	// create profile's team
	team := models.Team{
		Name:         registerData.Name,
		OwnerProfile: createdProfile.Id,
	}
	err = h.TeamRepo.CreateTeam(team)
	if err != nil {
		http.Error(w, "Error al crear equipo", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(profile)
}
