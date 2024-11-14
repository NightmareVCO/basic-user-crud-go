package models

type Team struct {
	Id           int    `json:"id"`
	Name         string `json:"name"`
	OwnerProfile int    `json:"userOwner"`
}

type TeamUser struct {
	Id     int `json:"id"`
	TeamId int `json:"teamId"`
	UserId int `json:"userId"`
}

type Profile struct {
	Id       int    `json:"id"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type User struct {
	Id     int    `json:"id"`
	Name   string `json:"name"`
	Email  string `json:"email"`
	Status bool   `json:"status"`
}
