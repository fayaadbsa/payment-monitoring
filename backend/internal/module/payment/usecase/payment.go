package usecase

import (
	"context"

	"github.com/durianpay/fullstack-boilerplate/internal/entity"
	"github.com/durianpay/fullstack-boilerplate/internal/module/payment/repository"
)

type PaymentUsecase interface {
	ListPayments(ctx context.Context, status string, id string, merchant string, startDate string, endDate string, minAmount string, maxAmount string, sort string, limit int, offset int) ([]*entity.Payment, int, int, int, int, error)
}

type Payment struct {
	repo repository.PaymentRepository
}

func NewPaymentUsecase(repo repository.PaymentRepository) *Payment {
	return &Payment{repo: repo}
}

func (u *Payment) ListPayments(ctx context.Context, status string, id string, merchant string, startDate string, endDate string, minAmount string, maxAmount string, sort string, limit int, offset int) ([]*entity.Payment, int, int, int, int, error) {
	return u.repo.GetPayments(ctx, status, id, merchant, startDate, endDate, minAmount, maxAmount, sort, limit, offset)
}
