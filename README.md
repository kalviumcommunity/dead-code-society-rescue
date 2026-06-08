# LogiTrack API v2.0.0

> Production-ready shipment tracking backend built with Node.js, Express, MongoDB, and bcrypt.

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 20+ 
- MongoDB 4.4+ (local or Atlas)
- npm 10+

### 2. Install & Setup

```bash
# Clone repository
git clone https://github.com/your-org/logitrack-backend.git
cd logitrack-backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Update .env with your values (especially JWT_SECRET and DATABASE_URL)
nano .env
```

### 3. Start Development Server

```bash
# Run with auto-reload
npm run dev

# Or production mode
npm start
```

Server will listen on `http://localhost:3000`

## 📋 Environment Variables

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `PORT` | Yes | `3000` | Server port |
| `DATABASE_URL` | Yes | `mongodb://localhost:27017/logitrack` | MongoDB connection string |
| `JWT_SECRET` | Yes | `your-random-key-32-chars` | Min 32 chars, used to sign auth tokens |
| `NODE_ENV` | Yes | `development` | `development` or `production` |

⚠️ **Critical**: Generate a strong `JWT_SECRET`:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🏗 Architecture

```
Request → Route → Validation (Joi) → Auth (JWT) → Controller → Service → Model → MongoDB
```

### Folder Structure

```
src/
├── config/           # Database configuration
├── controllers/      # Request handlers (thin layer)
├── middlewares/      # Express middleware
├── routes/          # API route definitions
├── services/        # Business logic & DB operations
├── utils/           # Shared utilities (errors, hashing, JWT)
├── validators/      # Joi validation schemas
├── app.js          # Express app setup
└── server.js       # Entry point with DB connection
models/
├── User.js         # User schema with validation
└── Shipment.js     # Shipment schema with validation
```

## 📡 API Reference

### Authentication (No Auth Required)

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

### Users (Auth Required)

#### Get Profile
```http
GET /api/users/profile
Authorization: Bearer <token>
```

### Shipments (Auth Required)

#### Create Shipment
```http
POST /api/shipments
Authorization: Bearer <token>
Content-Type: application/json

{
  "origin": "New York",
  "destination": "Los Angeles",
  "weight": 5.5,
  "carrier": "FedEx"
}
```

Valid carriers: `FedEx`, `UPS`, `DHL`, `USPS`

#### List Shipments
```http
GET /api/shipments
Authorization: Bearer <token>
```

#### Get Single Shipment
```http
GET /api/shipments/:id
Authorization: Bearer <token>
```

#### Update Status (Admin Only)
```http
PATCH /api/shipments/:id/status
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "status": "delivered"
}
```

Valid statuses: `pending`, `in-progress`, `delivered`, `cancelled`

#### Delete Shipment (Admin Only)
```http
DELETE /api/shipments/:id
Authorization: Bearer <admin-token>
```

## 🔐 Security Improvements

| Issue | v1.0.0 | v2.0.0 |
|-------|--------|--------|
| Password Hashing | MD5 (30min to crack) | bcrypt 12-rounds (~400ms) |
| Input Validation | None (NoSQL injection risk) | Joi schemas + sanitization |
| Code Structure | 600-line monolith | MVC architecture |
| Auth Duplication | 6 copy-pasted blocks | Reusable middleware |
| N+1 Queries | 101 DB queries/100 items | 2 queries with populate() |
| Promise Chains | Unhandled errors | async/await + centralized handler |
| JWT Secret | `'secret123'` fallback | Enforced minimum 32 chars |
| HTTP Status | All 200 (even errors) | Proper codes (201, 404, 422, 409) |

## 📚 Documentation

- [AUDIT.md](AUDIT.md) - Complete code smell analysis and fixes
- [CHANGELOG.md](CHANGELOG.md) - Detailed migration guide from v1.0.0

## 📄 License

ISC
