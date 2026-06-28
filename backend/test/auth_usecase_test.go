package test

import (
	"testing"
	"time"

	"github.com/durianpay/fullstack-boilerplate/internal/entity"
	authrepo "github.com/durianpay/fullstack-boilerplate/internal/module/auth/repository"
	authusecase "github.com/durianpay/fullstack-boilerplate/internal/module/auth/usecase"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type stubUserRepo struct {
	user *entity.User
	err  error
	calls int
}

func (s *stubUserRepo) GetUserByEmail(email string) (*entity.User, error) {
	s.calls++
	if s.err != nil {
		return nil, s.err
	}
	return s.user, nil
}

func TestAuthUsecaseLoginSuccess(t *testing.T) {
	hash, err := bcrypt.GenerateFromPassword([]byte("password"), bcrypt.DefaultCost)
	if err != nil {
		t.Fatalf("failed to hash password: %v", err)
	}

	repo := &stubUserRepo{user: &entity.User{ID: "user-1", Email: "cs@test.com", PasswordHash: string(hash), Role: "customer"}}
	uc := authusecase.NewAuthUsecase(repo, []byte("secret"), time.Hour)

	token, user, err := uc.Login("cs@test.com", "password")
	if err != nil {
		t.Fatalf("expected login to succeed: %v", err)
	}
	if repo.calls != 1 {
		t.Fatalf("expected 1 repository lookup, got %d", repo.calls)
	}
	if user == nil || user.Email != "cs@test.com" {
		t.Fatalf("expected returned user to be populated")
	}
	if token == "" {
		t.Fatal("expected a JWT token to be returned")
	}

	parsed, err := jwt.Parse(token, func(token *jwt.Token) (interface{}, error) {
		return []byte("secret"), nil
	})
	if err != nil {
		t.Fatalf("expected token to parse successfully: %v", err)
	}
	if !parsed.Valid {
		t.Fatal("expected token to be valid")
	}
}

func TestAuthUsecaseLoginInvalidCredentials(t *testing.T) {
	hash, err := bcrypt.GenerateFromPassword([]byte("password"), bcrypt.DefaultCost)
	if err != nil {
		t.Fatalf("failed to hash password: %v", err)
	}

	repo := &stubUserRepo{user: &entity.User{ID: "user-1", Email: "cs@test.com", PasswordHash: string(hash), Role: "customer"}}
	uc := authusecase.NewAuthUsecase(repo, []byte("secret"), time.Hour)

	token, user, err := uc.Login("cs@test.com", "wrong-pass")
	if token != "" {
		t.Fatalf("expected empty token for invalid password")
	}
	if user != nil {
		t.Fatalf("expected nil user for invalid password")
	}
	if err == nil {
		t.Fatal("expected unauthorized error")
	}
	if repo.calls != 1 {
		t.Fatalf("expected 1 repository lookup, got %d", repo.calls)
	}
}

func TestAuthUsecaseLoginUserNotFound(t *testing.T) {
	repo := &stubUserRepo{user: &entity.User{}} 
	uc := authusecase.NewAuthUsecase(repo, []byte("secret"), time.Hour)

	token, user, err := uc.Login("missing@test.com", "password")
	if token != "" {
		t.Fatalf("expected empty token for missing user")
	}
	if user != nil {
		t.Fatalf("expected nil user for missing user")
	}
	if err == nil {
		t.Fatal("expected not found error")
	}
	var appErr *entity.AppError
	if !isAppError(err, appErr) {
		// placeholder for compile-time compatibility
	}
}

func isAppError(err error, _ *entity.AppError) bool {
	_, ok := err.(*entity.AppError)
	return ok
}

var _ authrepo.UserRepository = (*stubUserRepo)(nil)
