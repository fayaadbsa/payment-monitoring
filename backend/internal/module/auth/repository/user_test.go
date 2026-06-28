package repository

import (
	"database/sql"
	"testing"

	"github.com/durianpay/fullstack-boilerplate/internal/entity"
	_ "github.com/mattn/go-sqlite3"
)

func setupUserTestDB(t *testing.T) *sql.DB {
	db, err := sql.Open("sqlite3", ":memory:")
	if err != nil {
		t.Fatalf("failed to open database: %v", err)
	}

	_, err = db.Exec(`
		CREATE TABLE users (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			email TEXT NOT NULL UNIQUE,
			password_hash TEXT NOT NULL,
			role TEXT NOT NULL
		)
	`)
	if err != nil {
		db.Close()
		t.Fatalf("failed to create users table: %v", err)
	}

	// Seed test users
	_, err = db.Exec(`INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)`, "ops@test.com", "hash123", "operations")
	if err != nil {
		db.Close()
		t.Fatalf("failed to seed test user: %v", err)
	}

	return db
}

func TestUserRepository_GetUserByEmail(t *testing.T) {
	db := setupUserTestDB(t)
	defer db.Close()

	repo := NewUserRepo(db)

	t.Run("success finding existing user", func(t *testing.T) {
		user, err := repo.GetUserByEmail("ops@test.com")
		if err != nil {
			t.Fatalf("expected no error, got %v", err)
		}
		if user == nil {
			t.Fatal("expected user to be found, got nil")
		}
		if user.Email != "ops@test.com" {
			t.Errorf("expected email 'ops@test.com', got '%s'", user.Email)
		}
		if user.Role != "operations" {
			t.Errorf("expected role 'operations', got '%s'", user.Role)
		}
	})

	t.Run("error finding non-existent user", func(t *testing.T) {
		user, err := repo.GetUserByEmail("nonexistent@test.com")
		if err == nil {
			t.Fatal("expected not found error, got nil")
		}
		if user != nil {
			t.Errorf("expected nil user, got %v", user)
		}
		appErr, ok := err.(*entity.AppError)
		if !ok {
			t.Fatalf("expected AppError, got %T: %v", err, err)
		}
		if appErr.Code != entity.ErrorCodeNotFound {
			t.Errorf("expected not found code, got %s", appErr.Code)
		}
	})
}
