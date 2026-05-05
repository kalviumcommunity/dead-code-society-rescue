# Dead Code Society Rescue - Logistics Tracking API

## Overview

A production-ready Express.js backend API for logistics and shipment tracking. Provides user authentication, shipment management with real-time status tracking, and comprehensive role-based access control. Built with security, performance, and maintainability as core principles.

**Key Features:**
- User registration and authentication with JWT tokens
- Shipment creation, tracking, and status updates
- Role-based access control (user / admin)
- Input validation on all endpoints
- Centralized error handling
- Optimized database queries (no N+1 problems)
- Full API documentation with Swagger-ready responses

---

## Tech Stack

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Runtime** | Node.js | 14+ | JavaScript runtime |
| **Framework** | Express.js | ^4.17.1 | Web server framework |
| **Database** | MongoDB | 4.0+ | NoSQL document database |
| **ODM** | Mongoose | ^5.10.0 | MongoDB schema validation & querying |
| **Authentication** | JWT (jsonwebtoken) | ^8.5.1 | Stateless token authentication |
| **Password Hashing** | bcrypt | ^5.1.1 | Cryptographic password hashing (12 rounds) |
| **Input Validation** | Joi | ^17.13.3 | Schema validation middleware |
| **Environment** | dotenv | ^8.2.0 | Environment variable management |
| **CORS** | cors | ^2.8.5 | Cross-Origin Resource Sharing |

---

## Quick Start

### Prerequisites
- Node.js v14 or higher
- MongoDB v4.0 or higher (local or Atlas)
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Pavithra8805/dead-code-society-rescue.git
   cd dead-code-society-rescue
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your local settings
   nano .env
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   Server will start on `http://localhost:3000`

5. **Verify the server is running**
   ```bash
   curl http://localhost:3000/health
   # Expected response: {"status":"healthy"}
   ```

---

## Environment Variables

| Variable | Example | Required | Description |
|----------|---------|----------|-------------|
| **PORT** | `3000` | No | Server listening port (default: 3000) |
| **NODE_ENV** | `development` | No | Execution environment (development/production) |
| **MONGODB_URI** | `mongodb://localhost:27017/shipments` | Yes | MongoDB connection string |
| **JWT_SECRET** | `your-super-secret-key-min-32-chars` | Yes | Secret key for signing JWT tokens (min 32 chars) |
| **JWT_EXPIRY** | `12h` | No | JWT token expiration time (default: 12h) |
| **BCRYPT_ROUNDS** | `12` | No | Bcrypt password hashing rounds (default: 12) |

**Example .env file:**
```
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/logistics-app
JWT_SECRET=your-secret-key-must-be-at-least-32-characters-long
JWT_EXPIRY=12h
BCRYPT_ROUNDS=12
```

---

## API Reference

### Authentication Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/register` | No | Register new user with email/password |
| `POST` | `/login` | No | Login user and receive JWT token |

#### POST /register
**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```
**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### POST /login
**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```
**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "user-id",
    "email": "john@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "12h"
  }
}
```

---

### User Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/profile` | Yes | Get current user profile |

#### GET /profile
**Headers:**
```
Authorization: Bearer <token>
```
**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2026-05-06T10:30:00Z"
  }
}
```

---

### Shipment Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| `GET` | `/shipments` | Yes | Any | Get all shipments for current user |
| `GET` | `/shipments/:id` | Yes | Any | Get specific shipment details |
| `POST` | `/shipments` | Yes | Any | Create new shipment |
| `PATCH` | `/shipments/:id/status` | Yes | Any | Update shipment status |
| `DELETE` | `/shipments/:id` | Yes | Any | Delete shipment |

#### GET /shipments
**Headers:**
```
Authorization: Bearer <token>
```
**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "shipment-id",
      "trackingId": "TRACK-123456",
      "origin": "New York",
      "destination": "Los Angeles",
      "status": "in-progress",
      "weight": 25.5,
      "carrier": "FedEx",
      "userId": "user-id",
      "createdAt": "2026-05-06T10:30:00Z",
      "updatedAt": "2026-05-06T10:30:00Z"
    }
  ]
}
```

#### POST /shipments
**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```
**Request Body:**
```json
{
  "origin": "New York",
  "destination": "Los Angeles",
  "weight": 25.5,
  "carrier": "FedEx"
}
```
**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "shipment-id",
    "trackingId": "TRACK-123456",
    "origin": "New York",
    "destination": "Los Angeles",
    "status": "pending",
    "weight": 25.5,
    "carrier": "FedEx",
    "userId": "user-id"
  }
}
```

#### PATCH /shipments/:id/status
**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```
**Request Body:**
```json
{
  "status": "delivered"
}
```
**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "shipment-id",
    "status": "delivered",
    "updatedAt": "2026-05-06T11:45:00Z"
  }
}
```

#### DELETE /shipments/:id
**Headers:**
```
Authorization: Bearer <token>
```
**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Shipment deleted successfully"
  }
}
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                       CLIENT (Frontend/Mobile)                  │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTP/HTTPS
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                     EXPRESS.JS SERVER                           │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐         ┌──────────────────┐              │
│  │ CORS Middleware  │◄────────┤ Body Parser      │              │
│  └────────┬─────────┘         └──────────────────┘              │
│           │                                                     │
│           ▼                                                     │
│  ┌──────────────────────────────────────────────────┐           │
│  │         ROUTE HANDLERS                          │           │
│  │  ┌────────────────────────────────────────────┐ │           │
│  │  │ Authentication Routes                     │ │           │
│  │  │  • POST /register                        │ │           │
│  │  │  • POST /login                           │ │           │
│  │  └────────────────────────────────────────────┘ │           │
│  │  ┌────────────────────────────────────────────┐ │           │
│  │  │ User Routes                              │ │           │
│  │  │  • GET /profile (requireAuth)            │ │           │
│  │  └────────────────────────────────────────────┘ │           │
│  │  ┌────────────────────────────────────────────┐ │           │
│  │  │ Shipment Routes                          │ │           │
│  │  │  • GET /shipments (requireAuth)          │ │           │
│  │  │  • GET /shipments/:id (requireAuth)      │ │           │
│  │  │  • POST /shipments (validate+auth)       │ │           │
│  │  │  • PATCH /shipments/:id/status (auth)    │ │           │
│  │  │  • DELETE /shipments/:id (requireAuth)   │ │           │
│  │  └────────────────────────────────────────────┘ │           │
│  └──────────────────────────────────────────────────┘           │
│           │           │           │                            │
│           ▼           ▼           ▼                            │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐           │
│  │  Auth        │ │  User        │ │  Shipment    │           │
│  │  Controller  │ │  Controller  │ │  Controller  │           │
│  └──────┬───────┘ └──────┬───────┘ └──────┬───────┘           │
│         │                │                │                    │
│         ▼                ▼                ▼                    │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐           │
│  │  Auth        │ │  User        │ │  Shipment    │           │
│  │  Service     │ │  Service     │ │  Service     │           │
│  │              │ │              │ │              │           │
│  │ • register   │ │ • getProfile │ │ • create     │           │
│  │ • login      │ │              │ │ • getByUser  │           │
│  │ • verify JWT │ │              │ │ • getById    │           │
│  └──────┬───────┘ └──────┬───────┘ │ • updateStat │           │
│         │                │         │ • delete     │           │
│         │                │         └──────┬───────┘           │
│         │                │                │                    │
│         └────────────────┼────────────────┘                    │
│                          ▼                                      │
│                  ┌──────────────────┐                          │
│                  │ Utilities Layer  │                          │
│                  │                  │                          │
│                  │ • hash.util      │                          │
│                  │ • jwt.util       │                          │
│                  │ • errors.util    │                          │
│                  │ • response.util  │                          │
│                  └──────────────────┘                          │
│                                                                 │
│  ┌──────────────────────────────────────────────────┐           │
│  │         MIDDLEWARE STACK                        │           │
│  │  ┌────────────────────────────────────────────┐ │           │
│  │  │ Validation Middleware (Joi)               │ │           │
│  │  │ • Validates req.body against schemas      │ │           │
│  │  │ • Returns 422 on validation failures      │ │           │
│  │  └────────────────────────────────────────────┘ │           │
│  │  ┌────────────────────────────────────────────┐ │           │
│  │  │ Auth Middleware                           │ │           │
│  │  │ • Extracts JWT from Authorization header  │ │           │
│  │  │ • Verifies token and attaches userId      │ │           │
│  │  │ • Returns 401 if invalid                  │ │           │
│  │  └────────────────────────────────────────────┘ │           │
│  │  ┌────────────────────────────────────────────┐ │           │
│  │  │ Error Handler Middleware                  │ │           │
│  │  │ • Catches all errors from routes          │ │           │
│  │  │ • Maps to appropriate HTTP status codes   │ │           │
│  │  │ • Returns consistent error format         │ │           │
│  │  └────────────────────────────────────────────┘ │           │
│  └──────────────────────────────────────────────────┘           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                         │
                         │ Mongoose ODM
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MONGODB DATABASE                           │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────┐           │
│  │ Collections:                                     │           │
│  │  • users (schemas: name, email, password, role) │           │
│  │  • shipments (schemas: trackingId, origin,      │           │
│  │    destination, status, weight, carrier)        │           │
│  └──────────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────────┘
```

---

## Error Handling

All errors follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "data": { /* ... */ }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400
}
```

**Common HTTP Status Codes:**
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (resource already exists)
- `422` - Unprocessable Entity (validation failed)
- `500` - Internal Server Error

---

## Development

### Project Structure
```
src/
├── app.js                 # Express app configuration
├── server.js              # Server startup & DB connection
├── routes.js              # Route aggregation
├── controllers/           # Request handlers
├── services/              # Business logic
├── models/                # Mongoose schemas
├── middlewares/           # Express middlewares
├── validators/            # Joi validation schemas
└── utils/                 # Utility functions
```

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
```

---

## License

MIT License - See LICENSE file for details

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

---

## Support

For issues, questions, or feature requests, please open a GitHub issue.
