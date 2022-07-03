package models

import (
	"github.com/dgrijalva/jwt-go"
)

type Message struct {
	Message string `json:"message"`
	Error   string `json:"error"`
}

type Response struct {
	Status  int     `json:"status"`
	Message Message `json:"message"`
}

type User struct {
	ID       int64  `json:"id"`
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type Profile struct {
	ID    int64  `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
}

type LoginReq struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type RegisterReq struct {
	Email    string `json:"email"`
	Name     string `json:"username"`
	Password string `json:"password"`
}

type SelectExpertReq struct {
	AppGenID string `json:"app_gen_id"`
	ExpertID int64  `json:"expert_id"`
}

type JWTAuthClaims struct {
	Email string `json:"email"`
	jwt.StandardClaims
}

type Member struct {
	Name           string `json:"name"`
	Designation    string `json:"designation"`
	Department     string `json:"department"`
	Specialization string `json:"specialization"`
	Score          string `json:"score"`
	MemberId       int    `json:"member_id"`
}

type Expert struct {
	ID             int64    `json:"id"`
	AppGenID       string   `json:"app_gen_id"`
	Name           string   `json:"name"`
	Title          string   `json:"title"`
	DcMembers      []Member `json:"dc_members"`
	DcoMembers     []Member `json:"dco_members"`
	SelectedExpert string   `json:"selected_expert"`
}

type SelectedExpertRes struct {
	ID                   int64  `json:"id"`
	AppGenID             string `json:"app_gen_id"`
	Name                 string `json:"name"`
	Title                string `json:"title"`
	ExpertName           string `json:"expert_name"`
	ExpertDesignation    string `json:"expert_designation"`
	ExpertDepartment     string `json:"expert_department"`
	ExpertSpecialization string `json:"expert_specialization"`
	Score                string `json:"score"`
}

type Stats struct {
	Total    int64 `json:"total"`
	Selected int64 `json:"selected"`
}
