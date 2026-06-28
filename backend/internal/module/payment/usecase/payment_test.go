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

func (m *mockPaymentRepository) GetPayments(ctx context.Context, filterStatus string, filterID string, sortBy string) ([]*entity.Payment, error) {
	if m.err != nil {
		return nil, m.err
	}
	return m.payments, nil
}

func TestPaymentUsecase_ListPayments(t *testing.T) {
	t.Run("success", func(t *testing.T) {
		mockPayments := []*entity.Payment{
			{ID: "PAY-1", Merchant: "Merchant A", Status: "completed", Amount: "100.00"},
		}
		mockRepo := &mockPaymentRepository{payments: mockPayments}
		uc := NewPaymentUsecase(mockRepo)

		res, err := uc.ListPayments(context.Background(), "completed", "", "")
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if len(res) != 1 {
			t.Fatalf("expected 1 result, got %d", len(res))
		}
		if res[0].ID != "PAY-1" {
			t.Errorf("expected ID 'PAY-1', got '%s'", res[0].ID)
		}
	})

	t.Run("error", func(t *testing.T) {
		expectedErr := errors.New("database connection failed")
		mockRepo := &mockPaymentRepository{err: expectedErr}
		uc := NewPaymentUsecase(mockRepo)

		_, err := uc.ListPayments(context.Background(), "", "", "")
		if err == nil {
			t.Fatal("expected error, got nil")
		}
		if err != expectedErr {
			t.Errorf("expected error '%v', got '%v'", expectedErr, err)
		}
	})
}
