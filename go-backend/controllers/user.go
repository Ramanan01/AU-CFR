package controllers

import (
	"go-backend/models"
	"go-backend/services"
	"go-backend/utilities"
	"log"

	"github.com/gin-gonic/gin"
)

// Authenticate controller to authenticate the user
func Authenticate(c *gin.Context) {
	response := models.Response{}

	loginReq := models.LoginReq{}
	c.ShouldBindJSON(&loginReq)

	user, err := models.GetUser(loginReq.Email)

	if err != nil {
		response.Status = 400
		response.Message.Message = "Something went wrong at our end"
		response.Message.Error = err.Error()
		c.JSON(response.Status, gin.H{
			"response": response,
		})
		return
	}

	isMatch := utilities.VerifyPassword(loginReq.Password, user.Password)

	if isMatch {
		token := services.CreateHeader(c, loginReq.Email)
		models.CreateNewSession(user.ID, token)

		response.Status = 200
		response.Message.Message = "Successful"
		response.Message.Error = ""
		log.Println("------ Authenticate Done ------")
		c.JSON(response.Status, gin.H{
			"id":          user.ID,
			"name":        user.Name,
			"tokenString": token,
			"response":    response,
			"email":       loginReq.Email,
		})
		return
	}
	response.Status = 400
	response.Message.Message = "Invalid password"
	response.Message.Error = "Error"
	c.JSON(response.Status, gin.H{
		"response": response,
	})
}

//LogOut will remove header and redirect to home page
func LogOut(c *gin.Context) {
	token := c.Request.Header.Get("tokenString")
	models.ExpireSession(token)
	services.RemoveHeader(c, "tokenString")
	response := models.Response{
		Status: 200,
		Message: models.Message{
			Message: "Successful",
			Error:   "",
		},
	}
	log.Println("------ Logout Done ------")
	c.JSON(response.Status, gin.H{
		"response": response,
	})
}

func Register(c *gin.Context) {
	response := models.Response{}

	registerReq := models.RegisterReq{}
	c.ShouldBindJSON(&registerReq)

	log.Println(registerReq)
	user, err := models.GetUser(registerReq.Email)

	if user.ID > 0 {
		response.Status = 400
		response.Message.Message = "User already exist"
		response.Message.Error = "unsuccessful"
		if err != nil {
			log.Println("Register: error ->", err)
			response.Message.Message = "Something went wrong at our end"
			response.Message.Error = err.Error()
		}
		c.JSON(response.Status, gin.H{
			"response": response,
		})
		return
	}
	passwordHash, err := utilities.HashPassword(registerReq.Password)
	if err != nil {
		log.Println("Register: error ->", err)
		response.Status = 400
		response.Message.Message = "Something went wrong at our end"
		response.Message.Error = err.Error()
		c.JSON(response.Status, gin.H{
			"response": response,
		})
		return
	}
	registerReq.Password = passwordHash

	userID, err := models.CreateUser(&registerReq)
	if err != nil {
		log.Println("Register: error ->", err)
		response.Status = 400
		response.Message.Message = "Something went wrong at our end"
		response.Message.Error = err.Error()
		c.JSON(response.Status, gin.H{
			"response": response,
		})
		return
	}
	token := services.CreateHeader(c, registerReq.Email)
	models.CreateNewSession(userID, token)

	response.Status = 200
	response.Message.Message = "Registration successful"
	response.Message.Error = ""
	log.Println("------ Register Done ------")
	c.JSON(response.Status, gin.H{
		"tokenString": token,
		"response":    response,
	})
}

func UserProfileController(c *gin.Context) {
	token := c.Request.Header.Get("tokenString")
	response := models.Response{}
	if token == "" {
		log.Println("UserProfileController: token not found")
		response.Message.Message = "token not found"
		c.JSON(response.Status, gin.H{
			"response": response,
		})
		return
	}

	userID, err := models.GetUserIdByToken(token)
	if err != nil {
		response.Status = 400
		response.Message.Message = "Something went wrong at our end"
		log.Println("UserProfileController: Error -> ", err)
		c.JSON(response.Status, gin.H{
			"response": response,
		})
		return
	}

	profile, err := models.GetUserProfile(userID)
	if err != nil {
		log.Println("UserProfileController: GetUserProfile failed: ", err)
		response.Message.Error = err.Error()
		c.JSON(response.Status, gin.H{
			"response": response,
		})
		return
	}
	response.Status = 200
	response.Message.Message = "Successful"
	response.Message.Error = ""
	log.Println("------ User Profile Fetched Done ------")
	c.JSON(response.Status, gin.H{
		"response": response,
		"profile":  profile,
	})

}
