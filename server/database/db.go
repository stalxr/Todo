package database

import (
	"log"

	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect(path string) {
	database, err := gorm.Open(sqlite.Open(path), &gorm.Config{})
	if err != nil {
		log.Fatal("Не удаётся подключиться к бд:", err)
	}
	DB = database
	log.Println("Подключено к бд:", path)
}
