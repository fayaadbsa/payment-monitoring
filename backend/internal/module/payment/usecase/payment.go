package usecase

import (
	"context"

	"github.com/durianpay/fullstack-boilerplate/internal/entity"
	"github.com/durianpay/fullstack-boilerplate/internal/module/payment/repository"
)

type PaymentUsecase interface {
	ListPayments(ctx context.Context, status string, id string, sort string) ([]*entity.Payment, error)
}

type Payment struct {
	repo repository.PaymentRepository
}

func NewPaymentUsecase(repo repository.PaymentRepository) *Payment {
	return &Payment{repo: repo}
}

func (u *Payment) ListPayments(ctx context.Context, status string, id string, sort string) ([]*entity.Payment, error) {
	return u.repo.GetPayments(ctx, status, id, sort)
}
