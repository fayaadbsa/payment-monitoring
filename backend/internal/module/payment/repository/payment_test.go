package repository

import (
	"context"
	"database/sql"
	"testing"

	_ "github.com/mattn/go-sqlite3"
)

func setupTestDB(t *testing.T) *sql.DB {
	db, err := sql.Open("sqlite3", ":memory:")
	if err != nil {
		t.Fatalf("failed to open database: %v", err)
	}

	_, err = db.Exec(`
		CREATE TABLE payments (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			payment_id TEXT NOT NULL UNIQUE,
			merchant TEXT NOT NULL,
			status TEXT NOT NULL,
			amount TEXT NOT NULL,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP
		)
	`)
	if err != nil {
		db.Close()
		t.Fatalf("failed to create table: %v", err)
	}

	// Seed test data
	seedQuery := `INSERT INTO payments (payment_id, merchant, status, amount, created_at) VALUES (?, ?, ?, ?, ?)`
	seeds := []struct {
		ID        string
		Merchant  string
		Status    string
		Amount    string
		CreatedAt string
	}{
		{"PAY-1", "Merchant A", "completed", "150.00", "2026-06-28T10:00:00Z"},
		{"PAY-2", "Merchant B", "processing", "25.50", "2026-06-28T11:00:00Z"},
		{"PAY-3", "Merchant C", "failed", "9.99", "2026-06-28T09:00:00Z"},
		{"PAY-4", "Merchant A", "completed", "1200.00", "2026-06-27T15:00:00Z"},
	}

	for _, s := range seeds {
		_, err = db.Exec(seedQuery, s.ID, s.Merchant, s.Status, s.Amount, s.CreatedAt)
		if err != nil {
			db.Close()
			t.Fatalf("failed to seed test data: %v", err)
		}
	}

	return db
}

func TestSQLPaymentRepository_GetPayments(t *testing.T) {
	db := setupTestDB(t)
	defer db.Close()

	repo := NewSQLPaymentRepository(db)
	ctx := context.Background()

	t.Run("filter by status", func(t *testing.T) {
		res, err := repo.GetPayments(ctx, "completed", "", "")
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if len(res) != 2 {
			t.Errorf("expected 2 completed payments, got %d", len(res))
		}
		for _, p := range res {
			if p.Status != "completed" {
				t.Errorf("expected status 'completed', got '%s'", p.Status)
			}
		}
	})

	t.Run("filter by partial id", func(t *testing.T) {
		res, err := repo.GetPayments(ctx, "", "3", "")
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if len(res) != 1 {
			t.Fatalf("expected 1 payment matching ID '3', got %d", len(res))
		}
		if res[0].ID != "PAY-3" {
			t.Errorf("expected ID 'PAY-3', got '%s'", res[0].ID)
		}
	})

	t.Run("sort by created_at desc", func(t *testing.T) {
		res, err := repo.GetPayments(ctx, "", "", "-created_at")
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if len(res) != 4 {
			t.Fatalf("expected 4 payments, got %d", len(res))
		}
		// PAY-2 is newest (11:00) -> PAY-1 (10:00) -> PAY-3 (09:00) -> PAY-4 (prev day 15:00)
		expected := []string{"PAY-2", "PAY-1", "PAY-3", "PAY-4"}
		for i, id := range expected {
			if res[i].ID != id {
				t.Errorf("expected index %d to be %s, got %s", i, id, res[i].ID)
			}
		}
	})

	t.Run("sort by amount numerically", func(t *testing.T) {
		// Numerical sort verification: 9.99 (PAY-3) < 25.50 (PAY-2) < 150.00 (PAY-1) < 1200.00 (PAY-4)
		res, err := repo.GetPayments(ctx, "", "", "amount")
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if len(res) != 4 {
			t.Fatalf("expected 4 payments, got %d", len(res))
		}
		expected := []string{"PAY-3", "PAY-2", "PAY-1", "PAY-4"}
		for i, id := range expected {
			if res[i].ID != id {
				t.Errorf("expected index %d to be %s, got %s", i, id, res[i].ID)
			}
		}
	})
}
