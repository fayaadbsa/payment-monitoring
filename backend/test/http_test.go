package test

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/durianpay/fullstack-boilerplate/internal/entity"
	authhandler "github.com/durianpay/fullstack-boilerplate/internal/module/auth/handler"
	payhandler "github.com/durianpay/fullstack-boilerplate/internal/module/payment/handler"
	"github.com/durianpay/fullstack-boilerplate/internal/openapigen"
	httservice "github.com/durianpay/fullstack-boilerplate/internal/service/http"
	"github.com/golang-jwt/jwt/v5"
)

type stubAuthUsecase struct {
	token string
	user  *entity.User
	err   error
}

func (s stubAuthUsecase) Login(email string, password string) (string, *entity.User, error) {
	return s.token, s.user, s.err
}

type stubPaymentUsecase struct {
	capturedStatus   string
	capturedID       string
	capturedMerchant string
	capturedSort     string
	capturedLimit    int
	capturedOffset   int
	payments         []*entity.Payment
	err              error
}

func (s *stubPaymentUsecase) ListPayments(
	ctx context.Context,
	status, id, merchant, startDate, endDate, minAmount, maxAmount, sort string,
	limit, offset int,
) ([]*entity.Payment, int, int, int, int, error) {
	s.capturedStatus = status
	s.capturedID = id
	s.capturedMerchant = merchant
	s.capturedSort = sort
	s.capturedLimit = limit
	s.capturedOffset = offset
	if s.err != nil {
		return nil, 0, 0, 0, 0, s.err
	}
	return s.payments, len(s.payments), len(s.payments), 0, 0, nil
}

func TestAuthHandlerLoginReturnsJsonResponse(t *testing.T) {
	handler := authhandler.NewAuthHandler(stubAuthUsecase{
		token: "jwt-token",
		user:  &entity.User{Email: "cs@test.com", Role: "customer"},
	})
	req := httptest.NewRequest(http.MethodPost, "/dashboard/v1/auth/login",
		strings.NewReader(`{"email":"cs@test.com","password":"password"}`))
	rec := httptest.NewRecorder()

	handler.PostDashboardV1AuthLogin(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", rec.Code)
	}
	var payload openapigen.LoginResponse
	if err := json.NewDecoder(rec.Body).Decode(&payload); err != nil {
		t.Fatalf("expected valid json response: %v", err)
	}
	if payload.Token == nil || *payload.Token != "jwt-token" {
		t.Fatalf("expected token in response body")
	}
	if payload.Email == nil || *payload.Email != "cs@test.com" {
		t.Fatalf("expected email in response body")
	}
}

func TestPaymentHandlerRoutesQueryParamsAndReturnsOk(t *testing.T) {
	uc := &stubPaymentUsecase{
		payments: []*entity.Payment{{
			ID: "pay-1", Merchant: "Acme", Status: "completed",
			Amount: "100.00", CreatedAt: time.Now(),
		}},
	}
	handler := payhandler.NewPaymentHandler(uc)
	params := openapigen.GetDashboardV1PaymentsParams{
		Status:   ptr("completed"),
		Id:       ptr("pay"),
		Merchant: ptr("Acme"),
		Sort:     ptr("-amount"),
		Page:     ptrInt(1),
		Limit:    ptrInt(10),
	}
	req := httptest.NewRequest(http.MethodGet, "/dashboard/v1/payments", nil)
	rec := httptest.NewRecorder()

	handler.GetDashboardV1Payments(rec, req, params)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", rec.Code)
	}
	if uc.capturedStatus != "completed" || uc.capturedID != "pay" || uc.capturedMerchant != "Acme" || uc.capturedSort != "-amount" {
		t.Fatalf("unexpected usecase args: status=%q id=%q merchant=%q sort=%q",
			uc.capturedStatus, uc.capturedID, uc.capturedMerchant, uc.capturedSort)
	}
	if uc.capturedLimit != 10 || uc.capturedOffset != 0 {
		t.Fatalf("expected limit=10 offset=0, got limit=%d offset=%d", uc.capturedLimit, uc.capturedOffset)
	}

	var respBody openapigen.PaymentListResponse
	if err := json.NewDecoder(rec.Body).Decode(&respBody); err != nil {
		t.Fatalf("expected valid json response: %v", err)
	}
	if respBody.Total == nil || *respBody.Total != 1 {
		t.Fatalf("expected total=1 in response, got %v", respBody.Total)
	}
}

func TestValidateJWTRejectsMissingOrInvalidToken(t *testing.T) {
	secret := []byte("secret")
	handler := httservice.ValidateJWT(secret)(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		t.Fatal("next handler should not run")
	}))

	missingReq := httptest.NewRequest(http.MethodGet, "/dashboard/v1/payments", nil)
	missingRec := httptest.NewRecorder()
	handler.ServeHTTP(missingRec, missingReq)
	if missingRec.Code != http.StatusUnauthorized {
		t.Fatalf("expected 401 when token missing, got %d", missingRec.Code)
	}

	invalidReq := httptest.NewRequest(http.MethodGet, "/dashboard/v1/payments", nil)
	invalidReq.Header.Set("Authorization", "Bearer invalid-token")
	invalidRec := httptest.NewRecorder()
	handler.ServeHTTP(invalidRec, invalidReq)
	if invalidRec.Code != http.StatusUnauthorized {
		t.Fatalf("expected 401 when token invalid, got %d", invalidRec.Code)
	}
}

func TestValidateJWTAcceptsValidTokenAndSetsUserID(t *testing.T) {
	secret := []byte("secret")
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": "user-123",
		"exp": time.Now().Add(time.Hour).Unix(),
	})
	signed, err := token.SignedString(secret)
	if err != nil {
		t.Fatalf("failed to sign token: %v", err)
	}

	var captured string
	handler := httservice.ValidateJWT(secret)(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		captured = r.Context().Value(httservice.UserIDKey).(string)
		w.WriteHeader(http.StatusNoContent)
	}))

	req := httptest.NewRequest(http.MethodGet, "/dashboard/v1/payments", nil)
	req.Header.Set("Authorization", "Bearer "+signed)
	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, req)

	if rec.Code != http.StatusNoContent {
		t.Fatalf("expected 204, got %d", rec.Code)
	}
	if captured != "user-123" {
		t.Fatalf("expected user id to be propagated, got %q", captured)
	}
}

func ptr[T any](v T) *T { return &v }
func ptrInt(v int) *int { return &v }
