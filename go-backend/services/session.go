package services

import (
	"github.com/gin-gonic/gin"
)

// CreateHeader setting header as per jwt
func CreateHeader(c *gin.Context, email string) string {

	// SessionID := c.GetHeader("tokenString")
	SessionID, _ := CreateJWT(email)
	c.Header("tokenString", SessionID)

	return SessionID
}

// RemoveHeader used to remove header
func RemoveHeader(c *gin.Context, name string) {
	c.Header(name, "")
}
