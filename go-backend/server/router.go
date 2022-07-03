package server

import (
	"go-backend/controllers"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func NewRouter() *gin.Engine {

	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"*"},
		AllowHeaders:     []string{"*"},
		ExposeHeaders:    []string{"Content-Length", "Tokenstring"},
		AllowCredentials: true,
	}))
	gin.SetMode(os.Getenv("GIN_MODE"))

	api := router.Group("api")
	{
		auth := api.Group("/auth")
		{
			auth.POST("/signin", controllers.Authenticate)
			auth.GET("/logout", TokenAuth, controllers.LogOut)
			auth.POST("/signup", controllers.Register)
		}

		user := api.Group("/user")
		{
			user.GET("/profile", controllers.UserProfileController)
		}

		expert := api.Group("/expert") // for whole list
		{
			expert.GET("/next", controllers.GetNextExpertController)
			expert.PUT("/select", controllers.SelectExpertController)
			expert.GET("/select", controllers.GetSelectedExpertsController)
			expert.GET("/stats", controllers.GetStatsController)
		}
	}

	return router
}
