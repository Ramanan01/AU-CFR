package server

import (
	"log"
	"os"

	"github.com/gin-contrib/pprof"
	"github.com/joho/godotenv"
)

func Init() {

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file -> ", err)
	}
	r := NewRouter()
	pprof.Register(r)

	r.Run("localhost:" + os.Getenv("PORT"))
}
