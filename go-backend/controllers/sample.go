package controllers

import (
	"errors"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func Hello(c *gin.Context) {
	fmt.Println("Hello")
	c.JSON(http.StatusOK, gin.H{"response": "Hello"})
}

func Error(c *gin.Context) {
	err := errors.New("error message")
	c.JSON(http.StatusInternalServerError, gin.H{"error": true, "message": err.Error()})
}

func Panic(c *gin.Context) {
	panic("ggwp")
}
