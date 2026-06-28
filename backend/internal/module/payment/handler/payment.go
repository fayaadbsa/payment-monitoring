package handler

import (
	"encoding/json"
	"net/http"

	"github.com/durianpay/fullstack-boilerplate/internal/entity"
	"github.com/durianpay/fullstack-boilerplate/internal/module/payment/usecase"
	"github.com/durianpay/fullstack-boilerplate/internal/openapigen"
	"github.com/durianpay/fullstack-boilerplate/internal/transport"
)

type PaymentHandler struct {
	usecase usecase.PaymentUsecase
}

func NewPaymentHandler(uc usecase.PaymentUsecase) *PaymentHandler {
	return &PaymentHandler{usecase: uc}
}

func (h *PaymentHandler) GetDashboardV1Payments(w http.ResponseWriter, r *http.Request, params openapigen.GetDashboardV1PaymentsParams) {
	status := ""
	if params.Status != nil {
		status = *params.Status
	}
	id := ""
	if params.Id != nil {
		id = *params.Id
	}
	sort := ""
	if params.Sort != nil {
		sort = *params.Sort
	}

	payments, err := h.usecase.ListPayments(r.Context(), status, id, sort)
	if err != nil {
		transport.WriteError(w, err)
		return
	}

	apiPayments := make([]openapigen.Payment, len(payments))
	for i, p := range payments {
		idVal := p.ID
		merchantVal := p.Merchant
		statusVal := p.Status
		amountVal := p.Amount
		createdTime := p.CreatedAt

		apiPayments[i] = openapigen.Payment{
			Id:        &idVal,
			Merchant:  &merchantVal,
			Status:    &statusVal,
			Amount:    &amountVal,
			CreatedAt: &createdTime,
		}
	}

	response := openapigen.PaymentListResponse{
		Payments: &apiPayments,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	err = json.NewEncoder(w).Encode(response)
	if err != nil {
		transport.WriteAppError(w, entity.ErrorInternal("failed to encode response"))
		return
	}
}
