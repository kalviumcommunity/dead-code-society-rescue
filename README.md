# LogiTrack API — Shipment Tracking Backend

> A production-ready REST API for tracking shipments, refactored from a legacy codebase. Built with Node.js, Express, and MongoDB.

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js (Latest LTS) |
| Framework | Express 4 |
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken) |
| Validation | Joi |
| Hashing | bcrypt (12 rounds) |
| Documentation | JSDoc |

## 🚀 Quick Start

### 1. Clone and install
```bash
git clone https://github.com/kalviumcommunity/dead-code-society-rescue.git
cd dead-code-society-rescue
npm install
```

### 2. Set up environment
```bash
cp .env.example .env
# Fill in your DATABASE_URL and JWT_SECRET
```

### 3. Start the server
```bash
# Production
npm start

# Development (with nodemon)
npm run dev
```

## 🔑 Environment Variables

| Variable | Example | Required | Description |
|----------|---------|----------|-------------|
| PORT | 3000 | No | Server port (defaults to 3000) |
| DATABASE_URL | mongodb://localhost:27017/logitrack | Yes | MongoDB connection string |
| JWT_SECRET | your-very-secure-secret-key | Yes | Min 32 chars recommended |

## 📡 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register a new user |
| POST | `/api/auth/login` | No | Login and receive JWT |
| GET | `/api/users/profile` | Yes | Get current user profile |
| GET | `/api/shipments` | Yes | List all shipments for current user |
| GET | `/api/shipments/:id` | Yes | Get details of a single shipment |
| POST | `/api/shipments` | Yes | Create a new shipment |
| PATCH | `/api/shipments/:id/status` | Admin | Update status (Admin only) |
| DELETE | `/api/shipments/:id` | Owner/Admin | Delete a shipment |

## 🏗 Architecture

```text
Request
  └─► Router (src/routes/)
        └─► Middleware (src/middlewares/) - Auth & Validation
              └─► Controller (src/controllers/) - Request Parsing
                    └─► Service (src/services/) - Business Logic
                          └─► Model (src/models/) - Database
```

## 📜 Development Features
- **MVC Pattern**: Clear separation of concerns.
- **Security**: bcrypt 12 rounds for passwords, JWT for auth, Joi for input sanitization.
- **Optimized**: Fixed N+1 query problems using Mongoose `.populate()`.
- **Global Error Handling**: Custom error classes and central middleware.
- **Typed**: Comprehensive JSDoc for all exported functions.

