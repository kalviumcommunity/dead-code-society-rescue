# 🚚 LogiTrack - Shipment Tracking API

**LogiTrack** is a clean, secure, and well-documented Express.js + MongoDB API for tracking shipments. Built with modern best practices including input validation, bcrypt password hashing, JWT authentication, and proper error handling.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Architecture](#architecture)
- [Security Features](#security-features)

---

## Overview

LogiTrack enables small businesses to manage and track shipments with ease. Features include:

- **Secure Authentication**: JWT-based token authentication with bcrypt password hashing
- **User Management**: Register, login, and manage user profiles
- **Shipment Tracking**: Create, read, update, and delete shipments with status tracking
- **Role-Based Access**: Users and Admins with different permissions
- **Input Validation**: Joi schemas ensure clean and validated data
- **Error Handling**: Centralized middleware for consistent error responses

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Runtime** | Node.js | 14+ |
| **Framework** | Express.js | 4.17.1 |
| **Database** | MongoDB | 4.0+ |
| **Authentication** | JWT (jsonwebtoken) | 8.5.1 |
| **Password Hashing** | bcrypt | 6.0.0 |
| **Input Validation** | Joi | 18.2.1 |
| **Package Manager** | npm | 6.0+ |
| **Dev Server** | nodemon | 2.0.4 |

---

## Quick Start

### 1. Prerequisites
- Node.js v14 or higher
- MongoDB running locally or connection string available
- npm or yarn

### 2. Clone and Install

```bash
git clone https://github.com/kalviumcommunity/dead-code-society-rescue.git
cd dead-code-society-rescue
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```
PORT=3000
DATABASE_URL=mongodb://localhost:27017/logitrack
JWT_SECRET=your_super_secret_key_here
```

### 4. Start the Server

**Development (with auto-reload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

You should see:
```
Server is running on port 3000
--- DATABASE CONNECTED ---
```

### 5. Verify the API

```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "LogiTrack API is running",
  "timestamp": "2026-06-04T10:30:00.000Z"
}
```

---

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `3000` | Server port to listen on |
| `DATABASE_URL` | Yes | — | MongoDB connection string. Use `mongodb://localhost:27017/logitrack` for local testing |
| `JWT_SECRET` | No | `secret123` | Secret key for signing JWT tokens. Use a strong random string in production |

### Example .env

```
PORT=3000
DATABASE_URL=mongodb://localhost:27017/logitrack
JWT_SECRET=super_secret_logitrack_2019_dont_share
```

---

## Project Structure

```
src/
├── controllers/          # Request handlers - read req, call service, send res
│   ├── auth.controller.js
│   ├── user.controller.js
│   └── shipment.controller.js
├── services/            # Business logic - all app rules live here
│   ├── user.service.js
│   └── shipment.service.js
├── models/              # Mongoose schemas - database structure
│   ├── User.js
│   └── Shipment.js
├── routes/              # Express route definitions
│   ├── index.js         # Main API routes aggregator
│   ├── auth.routes.js
│   ├── user.routes.js
│   └── shipment.routes.js
├── middlewares/         # Express middleware
│   ├── auth.middleware.js    # JWT verification
│   ├── error.middleware.js   # Centralized error handler
│   └── validate.middleware.js # Joi schema validation
├── utils/               # Shared utilities
│   ├── errors.util.js   # Custom error classes
│   ├── constants.js     # App constants (status values, roles)
│   ├── response.util.js # Response formatting helpers
│   └── validators.js    # Joi validation schemas
└── app.js              # Express app setup and configuration
```

---

## API Reference

### Base URL
```
http://localhost:3000/api
```

### Response Format

All responses follow this format:

**Success (200, 201):**
```json
{
  "success": true,
  "message": "Optional message",
  "data": { /* response data */ }
}
```

**Error (4xx, 5xx):**
```json
{
  "success": false,
  "error": "Error message explaining what went wrong"
}
```

---

### Authentication Endpoints

#### Register a New User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2026-06-04T10:00:00.000Z"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### User Endpoints

#### Get Current User Profile
```http
GET /api/users/profile
Authorization: <JWT_TOKEN>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2026-06-04T10:00:00.000Z"
  }
}
```

---

### Shipment Endpoints

#### Create a Shipment
```http
POST /api/shipments
Authorization: <JWT_TOKEN>
Content-Type: application/json

{
  "origin": "New York, NY",
  "destination": "Los Angeles, CA",
  "weight": 50.5,
  "carrier": "FedEx"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Shipment created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "trackingId": "SHIP-1701620400000-45",
    "origin": "New York, NY",
    "destination": "Los Angeles, CA",
    "weight": 50.5,
    "carrier": "FedEx",
    "status": "pending",
    "userId": "507f1f77bcf86cd799439011",
    "createdAt": "2026-06-04T10:30:00.000Z",
    "updatedAt": "2026-06-04T10:30:00.000Z"
  }
}
```

#### Get All User Shipments
```http
GET /api/shipments
Authorization: <JWT_TOKEN>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "trackingId": "SHIP-1701620400000-45",
      "status": "pending",
      "origin": "New York, NY",
      "destination": "Los Angeles, CA",
      "weight": 50.5,
      "carrier": "FedEx"
    }
  ],
  "count": 1
}
```

#### Get Specific Shipment
```http
GET /api/shipments/:id
Authorization: <JWT_TOKEN>
```

**Response (200 OK):** Same format as individual shipment above.

#### Update Shipment Status
```http
PATCH /api/shipments/:id/status
Authorization: <JWT_TOKEN>
Content-Type: application/json

{
  "status": "in-progress"
}
```

Valid statuses: `pending`, `in-progress`, `delivered`, `cancelled`

**Response (200 OK):** Updated shipment object.

#### Delete a Shipment
```http
DELETE /api/shipments/:id
Authorization: <JWT_TOKEN>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Shipment deleted successfully"
}
```

---

### System Endpoints

#### Health Check
```http
GET /api/health
```

#### Server Status
```http
GET /api/status
```

---

## Architecture

### MVC Separation

```
Request → Route → Controller → Service → Model → Database
         ↓        ↓           ↓        ↓
       URL    Validate    Business  Database
       Method  Input      Logic     Operations
```

- **Routes**: Define URL paths and HTTP methods. Wire validation middleware.
- **Controllers**: Read request, call service, send response. No business logic.
- **Services**: All business logic (auth, validation, queries, calculations).
- **Models**: Mongoose schemas defining database structure.
- **Middlewares**: Cross-cutting concerns (auth, validation, error handling).

### Request Flow Example

When a user logs in:

1. **Route** (`auth.routes.js`): POST /auth/login matches and validates with Joi schema
2. **Middleware** (`validate.middleware.js`): Validates email/password format
3. **Controller** (`auth.controller.js`): Extracts email/password, calls userService.login()
4. **Service** (`user.service.js`): Finds user, compares password with bcrypt, signs JWT
5. **Error Middleware** (`error.middleware.js`): If error, catches and formats response
6. **Response**: Send back user + token to client

### Security & Performance Features

**Security:**
- ✅ Passwords hashed with bcrypt (12 rounds) - takes time to crack
- ✅ JWT tokens with 12-hour expiry - short-lived credentials
- ✅ Authorization checks - users can only access their own shipments
- ✅ Input validation with Joi - no injection attacks
- ✅ Centralized error handling - no sensitive data leaks

**Performance:**
- ✅ Fixed N+1 queries - uses `.populate()` instead of loops
- ✅ Consistent error structure - easy to parse and handle
- ✅ Proper HTTP status codes - clients know what happened

---

## Security Features

### Password Hashing (bcrypt)

```javascript
// Registration
const hashedPassword = await bcrypt.hash(password, 12);

// Login
const isValid = await bcrypt.compare(inputPassword, hashedPassword);
```

- **12 rounds**: Takes ~100ms per hash, making brute force impractical
- **MD5 removed**: Old code used MD5 which is instantly crackable

### JWT Authentication

```javascript
// Token generated on login
const token = jwt.sign(
  { id: user._id, role: user.role },
  JWT_SECRET,
  { expiresIn: '12h' }
);

// Token verified on protected routes
const decoded = jwt.verify(token, JWT_SECRET);
```

- **Expiration**: Tokens are only valid for 12 hours
- **Signature verification**: Tokens can't be forged

### Authorization Checks

Every shipment operation checks:
1. Is user authenticated? (via JWT in Authorization header)
2. Does user own this shipment OR is user an admin?

```javascript
if (shipment.userId.toString() !== userId && userRole !== 'admin') {
  throw new ForbiddenError('You do not have permission');
}
```

### Input Validation (Joi)

```javascript
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Validates before reaching controller
const { error, value } = schema.validate(req.body);
```

---

## Error Handling

All errors are caught by the centralized error middleware:

```javascript
// app.js
app.use(errorHandler); // Last middleware
```

Error responses are consistent:

```json
{
  "success": false,
  "error": "Email already exists"
}
```

HTTP status codes:
- **200**: Success
- **201**: Resource created
- **400**: Validation error
- **401**: Unauthorized (missing/invalid token)
- **403**: Forbidden (no permission)
- **404**: Not found
- **409**: Conflict (resource exists)
- **500**: Server error

---

## Common Issues & Solutions

**Q: "DATABASE CONNECTION ERROR"**
- Check MongoDB is running: `mongod`
- Check `DATABASE_URL` in .env is correct

**Q: "JWT verification failed"**
- Check token is included in `Authorization` header
- Check token hasn't expired (12 hours)
- Check `JWT_SECRET` matches in .env

**Q: "Email already exists"**
- This email is already registered
- Use a different email or reset the database

**Q: Port 3000 already in use**
- Change `PORT` in .env to 3001 or 8080
- Or kill existing process: `lsof -ti:3000 | xargs kill -9`

---

## Testing the API

### Using curl

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'

# Get token from login response, then:
# Get profile
curl -H "Authorization: <TOKEN>" http://localhost:3000/api/users/profile

# Create shipment
curl -X POST http://localhost:3000/api/shipments \
  -H "Authorization: <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"origin":"NY","destination":"LA","weight":50,"carrier":"FedEx"}'
```

### Using Postman

1. Import the following collection
2. Set `{{TOKEN}}` variable from login response
3. Run requests

---

## Next Steps for Production

- [ ] Add request rate limiting (express-rate-limit)
- [ ] Add request logging (morgan)
- [ ] Add HTTPS/SSL
- [ ] Setup CI/CD pipeline
- [ ] Add integration tests
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Add monitoring and alerting
- [ ] Setup database backups
- [ ] Add audit logging

---

## License

ISC

## Author

LogiTrack Team

