# Payment Monitoring App

This is a full-stack payment monitoring application designed to provide internal teams with real-time insight into incoming payments. The system features a Go backend utilizing SQLite for persistent storage, and a Next.js React frontend for managing authentication and displaying payment records.

---

## 🛠️ Prerequisites & Machine Configuration

- **Go**: Version `1.21+` (requires `CGO_ENABLED=1` for SQLite3 support)
- **Node.js**: Version `20+`
- **Docker & Docker Compose** (for containerized execution)
- **GNU Make**

---

## ⚙️ Installation & Dependency Setup

You can install all dependencies for both backend and frontend by navigating to their respective directories:

```bash
# Backend dependency setup
cd backend
make dep

# Frontend dependency setup
cd ../frontend
make install
```

---

## 🚀 Running the Project

### Using Docker Compose (Quickest & Easiest)
Bring up both the Go backend and Next.js frontend services in containerized mode:

```bash
docker compose up --build
```
* **Frontend UI**: available at `http://localhost:3000`
* **Backend API**: available at `http://localhost:8080`
* **Interactive Swagger UI API Docs**: available at `http://localhost:8080/docs`

---

### Running Locally (Development Mode)

#### 1. Setup Backend
```bash
cd backend
# 1. Setup local environment variables
cp env.sample .env

# 2. Generate OpenAPI structures & JWT secret key
make openapi-gen
make gen-secret

# 3. Run the Go backend server (runs on http://localhost:8080 by default)
make run
```

*Note: The SQLite database (`dashboard.db`) will be automatically initialized and seeded with 50 payment transactions (40 completed, 7 processing, 3 failed) and two users (`cs@test.com` and `operation@test.com` with password `password`).*

#### 2. Setup Frontend
```bash
cd frontend
# 1. Setup environment variables
cp .env.example .env

# 2. Run the local Next.js development server (runs on http://localhost:3000 by default)
make run
```

---

## 🧪 Testing

### Running Go Backend Unit Tests
To run unit and repository tests locally, your machine must have a C compiler (`gcc`) installed for SQLite support, as CGO is required:

```bash
cd backend
# Run backend tests
make test

# Or on Windows PowerShell
make test-ps
```

### Running Frontend Unit Tests
To run frontend unit tests locally:

```bash
cd frontend
make test
```

---

## 📖 API Documentation

The backend dynamically hosts the API specification using the embedded schema:

- **Swagger UI Interactive Docs**: Visit **`http://localhost:8080/docs`** once the server is running.
- **Raw JSON Specification**: Visit `http://localhost:8080/swagger.json`
- **OpenAPI Schema file**: [openapi.yaml](openapi.yaml)

---

## 🔑 Login Credentials

Login to the frontend by visiting `http://localhost:3000/login` using these seeded credentials:

- **Customer Support (CS)**: User `cs@test.com` | Password `password`
- **Operations Role**: User `operation@test.com` | Password `password`

---

## 🎥 Evidences

- Demo Video: [video-demo.mp4](assets/video-demo.mp4) (Place your recording under `/assets` directory or provide a public link here).
