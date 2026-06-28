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
	merchant := ""
	if params.Merchant != nil {
		merchant = *params.Merchant
	}
	startDate := ""
	if params.StartDate != nil {
		startDate = *params.StartDate
	}
	endDate := ""
	if params.EndDate != nil {
		endDate = *params.EndDate
	}
	minAmount := ""
	if params.MinAmount != nil {
		minAmount = *params.MinAmount
	}
	maxAmount := ""
	if params.MaxAmount != nil {
		maxAmount = *params.MaxAmount
	}
	sort := ""
	if params.Sort != nil {
		sort = *params.Sort
	}
	page := 1
	if params.Page != nil {
		page = *params.Page
	}
	limit := 10
	if params.Limit != nil {
		limit = *params.Limit
	}

	offset := (page - 1) * limit

	payments, total, totalCompleted, totalProcessing, totalFailed, err := h.usecase.ListPayments(r.Context(), status, id, merchant, startDate, endDate, minAmount, maxAmount, sort, limit, offset)
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
		Payments:        &apiPayments,
		Total:           &total,
		TotalCompleted:  &totalCompleted,
		TotalProcessing: &totalProcessing,
		TotalFailed:     &totalFailed,
		Page:            &page,
		Limit:           &limit,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	err = json.NewEncoder(w).Encode(response)
	if err != nil {
		transport.WriteAppError(w, entity.ErrorInternal("failed to encode response"))
		return
	}
}
