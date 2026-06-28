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
	GetPayments(ctx context.Context, filterStatus string, filterID string, filterMerchant string, startDate string, endDate string, minAmount string, maxAmount string, sortBy string, limit int, offset int) ([]*entity.Payment, int, int, int, int, error)
}

type SQLPaymentRepository struct {
	db *sql.DB
}

func NewSQLPaymentRepository(db *sql.DB) *SQLPaymentRepository {
	return &SQLPaymentRepository{db: db}
}

func (r *SQLPaymentRepository) GetPayments(ctx context.Context, filterStatus string, filterID string, filterMerchant string, startDate string, endDate string, minAmount string, maxAmount string, sortBy string, limit int, offset int) ([]*entity.Payment, int, int, int, int, error) {
	// Base query parts
	filterQuery := ""
	var args []interface{}

	if filterStatus != "" {
		filterQuery += " AND status = ?"
		args = append(args, filterStatus)
	}

	if filterID != "" {
		filterQuery += " AND payment_id LIKE ?"
		args = append(args, "%"+filterID+"%")
	}

	if filterMerchant != "" {
		filterQuery += " AND merchant LIKE ?"
		args = append(args, "%"+filterMerchant+"%")
	}

	if startDate != "" {
		filterQuery += " AND created_at >= ?"
		args = append(args, startDate)
	}

	if endDate != "" {
		filterQuery += " AND created_at <= ?"
		args = append(args, endDate)
	}

	if minAmount != "" {
		filterQuery += " AND CAST(amount AS REAL) >= ?"
		args = append(args, minAmount)
	}

	if maxAmount != "" {
		filterQuery += " AND CAST(amount AS REAL) <= ?"
		args = append(args, maxAmount)
	}

	// 1. Get status counts breakdown (group by status using filters)
	statusQuery := "SELECT status, COUNT(1) FROM payments WHERE 1=1" + filterQuery + " GROUP BY status"
	statusRows, err := r.db.QueryContext(ctx, statusQuery, args...)
	if err != nil {
		return nil, 0, 0, 0, 0, entity.WrapError(err, entity.ErrorCodeInternal, "database metrics query error")
	}
	defer statusRows.Close()

	var totalCompleted, totalProcessing, totalFailed int
	for statusRows.Next() {
		var status string
		var count int
		if err := statusRows.Scan(&status, &count); err == nil {
			switch status {
			case "completed":
				totalCompleted = count
			case "processing":
				totalProcessing = count
			case "failed":
				totalFailed = count
			}
		}
	}
	totalCount := totalCompleted + totalProcessing + totalFailed

	// 2. Sorting
	orderBy := "ORDER BY created_at DESC" // default sort
	if sortBy != "" {
		orderDir := "ASC"
		field := sortBy
		if strings.HasPrefix(sortBy, "-") {
			orderDir = "DESC"
			field = sortBy[1:]
		}

		switch field {
		case "id", "payment_id":
			orderBy = fmt.Sprintf("ORDER BY payment_id %s", orderDir)
		case "merchant":
			orderBy = fmt.Sprintf("ORDER BY merchant %s", orderDir)
		case "status":
			orderBy = fmt.Sprintf("ORDER BY status %s", orderDir)
		case "created_at":
			orderBy = fmt.Sprintf("ORDER BY created_at %s", orderDir)
		case "amount":
			orderBy = fmt.Sprintf("ORDER BY CAST(amount AS REAL) %s", orderDir)
		}
	}

	// 3. Construct paginated query
	query := "SELECT payment_id, merchant, status, amount, created_at FROM payments WHERE 1=1" + filterQuery + " " + orderBy

	var paginatedArgs = make([]interface{}, len(args))
	copy(paginatedArgs, args)

	if limit > 0 {
		query += " LIMIT ?"
		paginatedArgs = append(paginatedArgs, limit)
		if offset >= 0 {
			query += " OFFSET ?"
			paginatedArgs = append(paginatedArgs, offset)
		}
	}

	rows, err := r.db.QueryContext(ctx, query, paginatedArgs...)
	if err != nil {
		return nil, 0, 0, 0, 0, entity.WrapError(err, entity.ErrorCodeInternal, "database query error")
	}
	defer rows.Close()

	var payments []*entity.Payment
	for rows.Next() {
		var p entity.Payment
		var createdAtStr string
		err := rows.Scan(&p.ID, &p.Merchant, &p.Status, &p.Amount, &createdAtStr)
		if err != nil {
			return nil, 0, 0, 0, 0, entity.WrapError(err, entity.ErrorCodeInternal, "failed to scan payment row")
		}

		// Parse SQLite created_at datetime string
		t, err := time.Parse(time.RFC3339, createdAtStr)
		if err != nil {
			t, err = time.Parse("2006-01-02 15:04:05", createdAtStr)
			if err != nil {
				t = time.Now()
			}
		}
		p.CreatedAt = t
		payments = append(payments, &p)
	}

	if err = rows.Err(); err != nil {
		return nil, 0, 0, 0, 0, entity.WrapError(err, entity.ErrorCodeInternal, "rows iteration error")
	}

	return payments, totalCount, totalCompleted, totalProcessing, totalFailed, nil
}
