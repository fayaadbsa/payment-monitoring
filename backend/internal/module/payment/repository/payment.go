package repository

import (
	"context"
	"database/sql"
	"fmt"
	"strings"
	"time"

	"github.com/durianpay/fullstack-boilerplate/internal/entity"
)

type PaymentRepository interface {
	GetPayments(ctx context.Context, filterStatus string, filterID string, sortBy string) ([]*entity.Payment, error)
}

type SQLPaymentRepository struct {
	db *sql.DB
}

func NewSQLPaymentRepository(db *sql.DB) *SQLPaymentRepository {
	return &SQLPaymentRepository{db: db}
}

func (r *SQLPaymentRepository) GetPayments(ctx context.Context, filterStatus string, filterID string, sortBy string) ([]*entity.Payment, error) {
	query := "SELECT payment_id, merchant, status, amount, created_at FROM payments WHERE 1=1"
	var args []interface{}

	if filterStatus != "" {
		query += " AND status = ?"
		args = append(args, filterStatus)
	}

	if filterID != "" {
		query += " AND payment_id LIKE ?"
		args = append(args, "%"+filterID+"%")
	}

	// Sorting
	orderBy := "ORDER BY created_at DESC" // default sort
	if sortBy != "" {
		orderDir := "ASC"
		field := sortBy
		if strings.HasPrefix(sortBy, "-") {
			orderDir = "DESC"
			field = sortBy[1:]
		}

		switch field {
		case "created_at":
			orderBy = fmt.Sprintf("ORDER BY created_at %s", orderDir)
		case "amount":
			// Cast to REAL for correct numerical sort since amount is stored as TEXT
			orderBy = fmt.Sprintf("ORDER BY CAST(amount AS REAL) %s", orderDir)
		}
	}

	query += " " + orderBy

	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, entity.WrapError(err, entity.ErrorCodeInternal, "database query error")
	}
	defer rows.Close()

	var payments []*entity.Payment
	for rows.Next() {
		var p entity.Payment
		var createdAtStr string
		err := rows.Scan(&p.ID, &p.Merchant, &p.Status, &p.Amount, &createdAtStr)
		if err != nil {
			return nil, entity.WrapError(err, entity.ErrorCodeInternal, "failed to scan payment row")
		}

		// Parse SQLite created_at datetime string (standard formats: RFC3339 or ISO-8601 like '2026-06-28T09:12:00Z')
		t, err := time.Parse(time.RFC3339, createdAtStr)
		if err != nil {
			// fallback parse
			t, err = time.Parse("2006-01-02 15:04:05", createdAtStr)
			if err != nil {
				t = time.Now() // default fallback
			}
		}
		p.CreatedAt = t
		payments = append(payments, &p)
	}

	if err = rows.Err(); err != nil {
		return nil, entity.WrapError(err, entity.ErrorCodeInternal, "rows iteration error")
	}

	return payments, nil
}
