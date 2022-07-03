package server

import (
	"go-backend/models"
	"go-backend/services"
	"log"

	"github.com/gin-gonic/gin"
)

//TokenAuth redirect to login page if user is not login
func TokenAuth(c *gin.Context) {

	tokenString := c.Request.Header.Get("tokenString")
	if tokenString == "" {
		log.Println("TokenAuth: tokenString not found")
		return
	}
	Valid, err := services.VerifyJWT(tokenString)
	if !Valid || err != nil {
		log.Println("TokenAuth: !Valid or err != nil. Valid : ", Valid, "error :", err)
		return
	}
	Valid, err = models.CheckSession(tokenString)
	if err != nil {
		log.Println("TokenAuth: error -> ", err)
		return
	}
	if !Valid {
		log.Println("TokenAuth: !Valid : ", Valid)
		return
	}
	c.Next()
}
