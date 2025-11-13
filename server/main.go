package main

import (
	"log"
	"os"
	"strings"
	"time"
	"todo-go/controllers"
	"todo-go/database"
	"todo-go/middleware"
	"todo-go/models"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

var JWTSecret []byte

func main() {
	_ = godotenv.Load()

	// Устанавливаем режим Gin в зависимости от окружения
	ginMode := os.Getenv("GIN_MODE")
	if ginMode == "" {
		if os.Getenv("PORT") != "" {
			// Если PORT установлен (обычно в продакшене), используем release режим
			ginMode = gin.ReleaseMode
		} else {
			ginMode = gin.DebugMode
		}
		gin.SetMode(ginMode)
	}

	dbPath := os.Getenv("DATABASE_PATH")
	if dbPath == "" {
		dbPath = "todo.db"
	}
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "dev_secret_change_me"
	}
	JWTSecret = []byte(secret)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	database.Connect(dbPath)

	sqlDB, err := database.DB.DB()
	if err != nil {
		log.Fatalf("failed to get sql.DB: %v", err)
	}
	if _, err := sqlDB.Exec("PRAGMA foreign_keys = ON;"); err != nil {
		log.Fatalf("failed to enable foreign_keys: %v", err)
	}

	database.DB.AutoMigrate(&models.User{}, &models.Todo{})

	controllers.JWTSecret = JWTSecret
	middleware.JWTSecret = JWTSecret

	r := gin.Default()
	if err := r.SetTrustedProxies(nil); err != nil {
		log.Fatalf("failed to set trusted proxies: %v", err)
	}

	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "Сервер работает"})
	})

	allowOrigin := os.Getenv("ALLOW_ORIGIN")
	var allowOrigins []string
	if allowOrigin != "" {
		for _, origin := range strings.Split(allowOrigin, ",") {
			trimmed := strings.TrimSpace(origin)
			if trimmed != "" {
				allowOrigins = append(allowOrigins, trimmed)
			}
		}
	}
	corsConfig := cors.Config{
		AllowMethods:  []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:  []string{"Authorization", "Content-Type"},
		ExposeHeaders: []string{"Content-Length"},
		MaxAge:        12 * time.Hour,
	}
	if len(allowOrigins) == 0 {
		corsConfig.AllowAllOrigins = true
		corsConfig.AllowCredentials = false
	} else {
		corsConfig.AllowOrigins = allowOrigins
		corsConfig.AllowCredentials = true
	}
	r.Use(cors.New(corsConfig))

	r.GET("/health", func(c *gin.Context) {
		if err := sqlDB.Ping(); err != nil {
			c.JSON(500, gin.H{"db": "error", "err": err.Error()})
			return
		}
		c.JSON(200, gin.H{"db": "ok"})
	})

	r.POST("/register", controllers.Register)
	r.POST("/login", controllers.Login)

	authRoutes := r.Group("/")
	authRoutes.Use(middleware.AuthMiddleware())
	{
		authRoutes.PUT("/todos/:id", controllers.UpdateTodo)
		authRoutes.GET("/todos", controllers.GetTodos)
		authRoutes.POST("/todos", controllers.CreateTodo)
		authRoutes.DELETE("/todos/:id", controllers.DeleteTodo)
	}

	log.Printf("listening on :%s, db=%s", port, dbPath)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("server failed: %v", err)
	}
}
