package usecase

import (
	"context"
	"errors"
	"testing"

	"github.com/durianpay/fullstack-boilerplate/internal/entity"
)

type mockPaymentRepository struct {
	payments []*entity.Payment
	err      error
}

func (m *mockPaymentRepository) GetPayments(ctx context.Context, filterStatus string, filterID string, filterMerchant string, startDate string, endDate string, minAmount string, maxAmount string, sortBy string, limit int, offset int) ([]*entity.Payment, int, int, int, int, error) {
	if m.err != nil {
		return nil, 0, 0, 0, 0, m.err
	}
	return m.payments, len(m.payments), len(m.payments), 0, 0, nil
}

func TestPaymentUsecase_ListPayments(t *testing.T) {
	t.Run("success", func(t *testing.T) {
		mockPayments := []*entity.Payment{
			{ID: "PAY-1", Merchant: "Merchant A", Status: "completed", Amount: "100.00"},
		}
		mockRepo := &mockPaymentRepository{payments: mockPayments}
		uc := NewPaymentUsecase(mockRepo)

		res, total, completed, processing, failed, err := uc.ListPayments(context.Background(), "completed", "", "", "", "", "", "", "", 10, 0)
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if len(res) != 1 {
			t.Fatalf("expected 1 result, got %d", len(res))
		}
		if total != 1 {
			t.Errorf("expected total count 1, got %d", total)
		}
		if completed != 1 {
			t.Errorf("expected completed count 1, got %d", completed)
		}
		if processing != 0 || failed != 0 {
			t.Errorf("expected zero for other counts, got processing=%d failed=%d", processing, failed)
		}
		if res[0].ID != "PAY-1" {
			t.Errorf("expected ID 'PAY-1', got '%s'", res[0].ID)
		}
	})

	t.Run("error", func(t *testing.T) {
		expectedErr := errors.New("database connection failed")
		mockRepo := &mockPaymentRepository{err: expectedErr}
		uc := NewPaymentUsecase(mockRepo)

		_, _, _, _, _, err := uc.ListPayments(context.Background(), "", "", "", "", "", "", "", "", 10, 0)
		if err == nil {
			t.Fatal("expected error, got nil")
		}
		if err != expectedErr {
			t.Errorf("expected error '%v', got '%v'", expectedErr, err)
		}
	})
}
