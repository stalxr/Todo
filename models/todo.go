package models

import "time"

type Todo struct {
	ID        uint   `gorm:"primaryKey"`
	Title     string `gorm:"not null"`
	IsDone    bool   `gorm:"default:false"`
	CreatedAt time.Time
	UserID    uint `gorm:"not null"`
}
