package test

import (
	"context"
	"testing"
	"time"

	"github.com/durianpay/fullstack-boilerplate/internal/entity"
	payrepo "github.com/durianpay/fullstack-boilerplate/internal/module/payment/repository"
	payusecase "github.com/durianpay/fullstack-boilerplate/internal/module/payment/usecase"
)

type stubPaymentRepo struct {
	calls        int
	lastStatus   string
	lastID       string
	lastMerchant string
	lastStart    string
	lastEnd      string
	lastMin      string
	lastMax      string
	lastSort     string
	lastLimit    int
	lastOffset   int
	payments     []*entity.Payment
	err          error
}

func (s *stubPaymentRepo) GetPayments(ctx context.Context, filterStatus string, filterID string, filterMerchant string, startDate string, endDate string, minAmount string, maxAmount string, sortBy string, limit int, offset int) ([]*entity.Payment, int, int, int, int, error) {
	s.calls++
	s.lastStatus = filterStatus
	s.lastID = filterID
	s.lastMerchant = filterMerchant
	s.lastStart = startDate
	s.lastEnd = endDate
	s.lastMin = minAmount
	s.lastMax = maxAmount
	s.lastSort = sortBy
	s.lastLimit = limit
	s.lastOffset = offset
	if s.err != nil {
		return nil, 0, 0, 0, 0, s.err
	}
	return s.payments, len(s.payments), len(s.payments), 0, 0, nil
}

func TestPaymentUsecaseListPaymentsDelegatesAndSanitizesParams(t *testing.T) {
	repo := &stubPaymentRepo{
		payments: []*entity.Payment{{ID: "pay-1", Merchant: "Acme", Status: "completed", Amount: "100.00", CreatedAt: time.Now()}},
	}
	uc := payusecase.NewPaymentUsecase(repo)

	payments, total, completed, processing, failed, err := uc.ListPayments(context.Background(), "completed", "pay", "Acme", "2026-06-01", "2026-06-30", "50", "200", "-amount", 10, 0)
	if err != nil {
		t.Fatalf("expected payment listing to succeed: %v", err)
	}
	if repo.calls != 1 {
		t.Fatalf("expected repository to be called once, got %d", repo.calls)
	}
	if repo.lastStatus != "completed" || repo.lastID != "pay" || repo.lastMerchant != "Acme" || repo.lastSort != "-amount" {
		t.Fatalf("unexpected parameters: status=%q id=%q merchant=%q sort=%q", repo.lastStatus, repo.lastID, repo.lastMerchant, repo.lastSort)
	}
	if repo.lastLimit != 10 || repo.lastOffset != 0 {
		t.Fatalf("unexpected limit/offset: limit=%d offset=%d", repo.lastLimit, repo.lastOffset)
	}
	if len(payments) != 1 || payments[0].ID != "pay-1" || total != 1 || completed != 1 || processing != 0 || failed != 0 {
		t.Fatalf("expected one payment to be returned with correct counts")
	}
}

var _ payrepo.PaymentRepository = (*stubPaymentRepo)(nil)
