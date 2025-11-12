package controllers

import (
	"errors"
	"net/http"
	"strconv"
	"time"
	"todo-go/database"
	"todo-go/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type TodoInput struct {
	Title  string `json:"title" binding:"required"`
	IsDone bool   `json:"is_done"`
}

func GetTodos(c *gin.Context) {
	userID, ok := userIDFromContext(c)
	if !ok {
		return
	}

	var todos []models.Todo
	if err := database.DB.Where("user_id = ?", userID).Find(&todos).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Не удалось получить задачи"})
		return
	}
	c.JSON(http.StatusOK, todos)
}

func CreateTodo(c *gin.Context) {
	userID, ok := userIDFromContext(c)
	if !ok {
		return
	}

	var input TodoInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	todo := models.Todo{
		Title:     input.Title,
		IsDone:    input.IsDone,
		UserID:    userID,
		CreatedAt: time.Now(),
	}

	if err := database.DB.Create(&todo).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Не удалось создать задачу"})
		return
	}
	c.JSON(http.StatusCreated, todo)
}

func DeleteTodo(c *gin.Context) {
	userID, ok := userIDFromContext(c)
	if !ok {
		return
	}
	id := c.Param("id")

	var todo models.Todo
	if err := database.DB.Where("id = ? AND user_id = ?", id, userID).First(&todo).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Задача не найдена"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Не удалось найти задачу"})
		return
	}

	if err := database.DB.Delete(&todo).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Не удалось удалить задачу"})
		return
	}
	c.Status(http.StatusNoContent)
}

func UpdateTodo(c *gin.Context) {
	userID, ok := userIDFromContext(c)
	if !ok {
		return
	}

	idParam := c.Param("id")
	idUint, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		c.JSON(400, gin.H{"error": "invalid id"})
		return
	}
	todoID := uint(idUint)

	var body struct {
		Title  *string `json:"title"`
		IsDone *bool   `json:"is_done"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(400, gin.H{"error": "invalid body", "detail": err.Error()})
		return
	}

	var todo models.Todo
	if err := database.DB.Where("id = ? AND user_id = ?", todoID, userID).First(&todo).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(404, gin.H{"error": "todo not found"})
			return
		}
		c.JSON(500, gin.H{"error": "db error", "detail": err.Error()})
		return
	}

	updates := map[string]interface{}{}
	if body.Title != nil {
		updates["title"] = *body.Title
	}
	if body.IsDone != nil {
		updates["is_done"] = *body.IsDone
	}
	if len(updates) == 0 {
		c.JSON(400, gin.H{"error": "nothing to update"})
		return
	}

	if err := database.DB.Model(&todo).Updates(updates).Error; err != nil {
		c.JSON(500, gin.H{"error": "failed to update", "detail": err.Error()})
		return
	}

	c.JSON(200, todo)
}

func userIDFromContext(c *gin.Context) (uint, bool) {
	uid, ok := c.Get("userID")
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Требуется авторизация"})
		return 0, false
	}
	userID, ok := uid.(uint)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Некорректный идентификатор пользователя"})
		return 0, false
	}
	return userID, true
}
