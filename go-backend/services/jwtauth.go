package services

import (
	"go-backend/models"
	"log"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
)

// GetTimeJWT to get time of 30 min
func GetTimeJWT() time.Time {
	return time.Now().Add(time.Hour)
}

// CreateJWT will create JWT string and send
func CreateJWT(email string) (string, error) {
	expirationTime := GetTimeJWT()

	claims := &models.JWTAuthClaims{
		Email: email,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	var jwtKey = []byte(os.Getenv("JWT_SECRET_KEY"))
	tokenString, err := token.SignedString(jwtKey)

	if err != nil {
		log.Println("CreateJWT: tokenString -> ", err)
	}
	// log.Println("tokenString : ", tokenString)

	return tokenString, err
}

//VerifyJWT will verify JWT key
func VerifyJWT(tokenString string) (bool, error) {
	claims := &models.JWTAuthClaims{}
	var jwtKey = []byte(os.Getenv("JWT_SECRET_KEY"))

	tkn, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})

	if err != nil {
		log.Println("error at ParseWithClaims : ", err.Error())
	}

	return tkn.Valid, err
}
