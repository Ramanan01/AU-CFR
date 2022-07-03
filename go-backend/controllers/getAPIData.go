package controllers

import (
	"go-backend/models"
	"log"

	"github.com/gin-gonic/gin"
)

func GetNextExpertController(c *gin.Context) {
	offset := c.Query("offset")

	result, err := models.GetNextExpert(offset)

	response := models.Response{}
	if err != nil {
		log.Println("GetNextExpertController: failed -> ", err)
		response.Status = 400
		response.Message.Message = "Something went wrong"
		response.Message.Error = err.Error()
		c.JSON(response.Status, gin.H{
			"response": response,
		})
		return
	}
	response.Status = 200
	response.Message.Message = "Successful"
	response.Message.Error = ""
	log.Println("------ Expert Fetched Done ------")
	c.JSON(response.Status, gin.H{
		"response": response,
		"expert":   result,
	})
}

func SelectExpertController(c *gin.Context) {
	selectExpertReq := models.SelectExpertReq{}
	c.ShouldBindJSON(&selectExpertReq)

	response := models.Response{}
	err := models.UpdateSelectExpert(selectExpertReq)
	if err != nil {
		log.Println("SelectExpertController: failed -> ", err)
		response.Status = 400
		response.Message.Message = "Something went wrong"
		response.Message.Error = err.Error()
		c.JSON(response.Status, gin.H{
			"response": response,
		})
		return
	}
	response.Status = 200
	response.Message.Message = "Successful"
	response.Message.Error = ""
	log.Println("------ Selected Expert Done ------")
	c.JSON(response.Status, gin.H{
		"response": response,
	})
}

func GetSelectedExpertsController(c *gin.Context) {
	response := models.Response{}
	result, err := models.GetSelectedExpert()
	if err != nil {
		log.Println("GetSelectedExpertsController: failed -> ", err)
		response.Status = 400
		response.Message.Message = "Something went wrong"
		response.Message.Error = err.Error()
		c.JSON(response.Status, gin.H{
			"response": response,
		})
		return
	}

	response.Status = 200
	response.Message.Message = "Successful"
	response.Message.Error = ""
	log.Println("------ Selected Expert Fetch Done ------")
	c.JSON(response.Status, gin.H{
		"response": response,
		"result":   result,
	})
}

func GetStatsController(c *gin.Context) {
	response := models.Response{}
	result, err := models.GetStats()
	if err != nil {
		log.Println("GetStatsController: failed -> ", err)
		response.Status = 400
		response.Message.Message = "Something went wrong"
		response.Message.Error = err.Error()
		c.JSON(response.Status, gin.H{
			"response": response,
		})
		return
	}

	response.Status = 200
	response.Message.Message = "Successful"
	response.Message.Error = ""
	log.Println("------ Stats Fetch Done ------")
	c.JSON(response.Status, gin.H{
		"response": response,
		"result":   result,
	})
}
