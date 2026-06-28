.PHONY: help install run build test lint format clean

help:
	@echo "Available commands in frontend:"
	@echo "  make install    - Install frontend dependencies"
	@echo "  make run        - Run Next.js frontend dev server"
	@echo "  make build      - Build frontend production assets"
	@echo "  make test       - Run frontend unit tests (Vitest)"
	@echo "  make lint       - Run ESLint checks"
	@echo "  make format     - Format frontend code with Prettier"
	@echo "  make clean      - Clean frontend build artifacts"

install:
	npm install

run:
	npm run dev

build:
	npm run build

test:
	npm run test

lint:
	npm run lint

format:
	npm run format

clean:
	rm -rf .next
	rm -rf out
