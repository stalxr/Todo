package database

import (
	"log"
	"os"

	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func Connect(path string) {
	// Настройка логгера GORM в зависимости от окружения
	var gormLogger logger.Interface
	if os.Getenv("GIN_MODE") == "release" {
		// В продакшене: логируем только ошибки, но не ErrRecordNotFound
		gormLogger = logger.New(
			log.New(os.Stdout, "\r\n", log.LstdFlags),
			logger.Config{
				SlowThreshold:             200,
				LogLevel:                  logger.Error,
				IgnoreRecordNotFoundError: true, // Игнорируем "record not found" ошибки
				Colorful:                  false,
			},
		)
	} else {
		// В разработке: более подробное логирование, но тоже игнорируем ErrRecordNotFound
		gormLogger = logger.New(
			log.New(os.Stdout, "\r\n", log.LstdFlags),
			logger.Config{
				SlowThreshold:             200,
				LogLevel:                  logger.Info,
				IgnoreRecordNotFoundError: true, // Игнорируем "record not found" ошибки
				Colorful:                  true,
			},
		)
	}

	database, err := gorm.Open(sqlite.Open(path), &gorm.Config{
		Logger: gormLogger,
	})
	if err != nil {
		log.Fatal("Не удаётся подключиться к бд:", err)
	}
	DB = database
	log.Println("Подключено к бд:", path)
}
