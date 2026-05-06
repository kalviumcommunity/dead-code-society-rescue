# 🚚 LogiTrack Backend - Refactored v2.0

A production-ready REST API for shipment tracking, built with Node.js, Express, and MongoDB. This codebase has been rescued from legacy code smell and restructured into a clean MVC architecture with enterprise-level security.

## ✨ What's New in v2.0

- ✅ **Replaced MD5 with bcrypt** — Passwords are now cryptographically secure (12 salt rounds)
- ✅ **Added Joi validation** — All inputs are validated and sanitized before processing
- ✅ **MVC architecture** — Clean separation of routes, controllers, services, and models
- ✅ **Centralized error handling** — Consistent error responses with proper HTTP status codes
- ✅ **Fixed N+1 queries** — Database queries optimized with `.populate()` and aggregation
- ✅ **Async/await patterns** — Replaced promise chains with clean, readable async functions
- ✅ **Removed var declarations** — All code uses `const` and `let` for block-scoped variables
- ✅ **Full JSDoc documentation** — Every function is documented with types, parameters, and examples
- ✅ **Added .env security** — Environment file is now in .gitignore to protect secrets

## 🛠 Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Runtime | Node.js | 20+ |
| Framework | Express.js | 4.17+ |
| Database | MongoDB + Mongoose | 5.10+ |
| Authentication | JWT (jsonwebtoken) | 8.5+ |
| Password Hashing | bcrypt | 6.0+ |
| Input Validation | Joi | 18.2+ |
| Environment | dotenv | 8.2+ |

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/your-org/logitrack-backend.git
cd logitrack-backend
npm install
```

### 2. Configure Environment

Copy the example environment file and update values:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=mongodb://localhost:27017/logitrack
JWT_SECRET=your-super-secret-key-minimum-32-chars-long
```

If port `3000` is already in use on your machine, choose another free port such as `3001` and update both your `.env` file and the local request URLs you use.

### 3. Start MongoDB

Ensure MongoDB is running locally or use a remote connection string:

```bash
# Local MongoDB
mongod --dbpath ./data

# Or use MongoDB Atlas cloud
# Update DATABASE_URL in .env to your cluster connection string
```

### 4. Run the Server

**Development (with hot reload via nodemon):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server will start on the PORT specified in `.env` (default: 3000).

✓ Check the console for: `Database connected successfully`

## 📋 Environment Variables

| Variable | Example | Required | Description |
|----------|---------|----------|-------------|
| PORT | 3000 | Yes | Server listening port |
| NODE_ENV | development | Yes | Environment: `development` or `production` |
| DATABASE_URL | mongodb://localhost:27017/logitrack | Yes | MongoDB connection string |
| JWT_SECRET | abc123...xyz (32+ chars) | Yes | Secret for signing JWT tokens. Use `openssl rand -hex 32` to generate |

## 🔐 API Authentication

All protected routes require a JWT token in the Authorization header:

```bash
Authorization: Bearer <your_jwt_token>
```

Get a token by calling `/api/auth/login` with valid credentials.

## 📡 API Reference

### Authentication Routes

#### Register New User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
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

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Get User Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": { ... }
}
```

### Shipment Routes

#### List User's Shipments
```http
GET /api/shipments
Authorization: Bearer <token>
```

#### Create Shipment
```http
POST /api/shipments
Authorization: Bearer <token>
Content-Type: application/json

{
  "origin": "New York, NY",
  "destination": "Los Angeles, CA",
  "weight": 15.5,
  "carrier": "FedEx"
}
```

#### Get Single Shipment
```http
GET /api/shipments/:id
Authorization: Bearer <token>
```

#### Update Shipment Status
```http
PATCH /api/shipments/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "in-progress"
}
```

**Valid statuses:** `pending`, `in-progress`, `delivered`, `cancelled`

Only **admins** can set status to `delivered`.

#### Delete Shipment
```http
DELETE /api/shipments/:id
Authorization: Bearer <token>
```

## 🏗 Architecture

```
Request
  ↓
Router (routes/)
  ↓
Middleware (authMiddleware, validateMiddleware)
  ↓
Controller (controllers/)
  ↓
Service (services/) — All business logic
  ↓
Model (models/) — Database schemas
  ↓
MongoDB
  ↓
Response
```

### Folder Structure

```
src/
├── routes/
│   ├── auth.routes.js          # Authentication endpoints
│   └── shipment.routes.js      # Shipment endpoints
├── controllers/
│   ├── auth.controller.js      # Handles auth requests
│   └── shipment.controller.js  # Handles shipment requests
├── services/
│   ├── auth.service.js         # Business logic: register, login
│   └── shipment.service.js     # Business logic: CRUD shipments
├── models/
│   ├── User.model.js           # User schema
│   └── Shipment.model.js       # Shipment schema
├── middlewares/
│   ├── auth.middleware.js      # JWT verification, role checking
│   ├── validate.middleware.js  # Joi schema validation
│   └── error.middleware.js     # Centralized error handler
├── validators/
│   ├── auth.validator.js       # Joi schemas for auth
│   └── shipment.validator.js   # Joi schemas for shipments
├── utils/
│   ├── errors.util.js          # Custom error classes
│   ├── jwt.util.js             # JWT generation and verification
│   └── constants.util.js       # Application constants
└── app.js                      # Express server setup
```

## 🔒 Security Features

### Password Hashing

Passwords are hashed using **bcrypt with 12 salt rounds**:
- Takes ~400ms per hash (slows down brute-force attacks)
- Uses random salt so identical passwords produce different hashes
- Impossible to reverse-engineer from the hash

### Input Validation

All request bodies are validated with **Joi schemas**:
- Validates email format, password strength
- Removes unexpected fields (stripUnknown)
- Returns 422 with clear error messages on validation failure

### JWT Authentication

- Tokens signed with `JWT_SECRET` (32+ characters)
- Tokens expire after 12 hours
- Authorization header required for protected routes

### SQL/NoSQL Injection Protection

- Mongoose prevents direct DB injection
- Joi validation sanitizes all inputs
- No raw MongoDB queries with user input

### Environment Secrets

- `.env` file is in `.gitignore` and never committed
- `.env.example` shows structure without secrets
- All secrets loaded from environment variables

## ✅ Error Handling

All errors return consistent JSON responses:

```json
{
  "error": "ValidationError",
  "message": "Password must contain at least one uppercase letter and one digit"
}
```

### HTTP Status Codes Used

- `200 OK` — Successful request
- `201 Created` — Resource created
- `400 Bad Request` — Invalid input
- `401 Unauthorized` — Missing or invalid token
- `403 Forbidden` — Access denied
- `404 Not Found` — Resource not found
- `409 Conflict` — Resource already exists
- `422 Unprocessable Entity` — Validation failed
- `500 Internal Server Error` — Server error

## 🧪 Testing the API

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Smith",
    "email": "alice@example.com",
    "password": "MySecurePass1"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "MySecurePass1"
  }'
```

**Create Shipment:**
```bash
curl -X POST http://localhost:3000/api/shipments \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "origin": "Chicago, IL",
    "destination": "Miami, FL",
    "weight": 25,
    "carrier": "UPS"
  }'
```

### Using Postman

1. Import this OpenAPI spec: [openapi.json](#) (to be created)
2. Set environment variable `{{token}}` with the JWT from login response
3. Run requests with Postman's built-in request builder

## 📊 Database Schema

### User Collection

```javascript
{
  _id: ObjectId,
  name: String,           // Required, 2-100 chars
  email: String,          // Required, unique, lowercase
  password: String,       // Required, bcrypt hash
  role: String,           // "user" or "admin" (default: "user")
  createdAt: Date,        // Timestamp
  updatedAt: Date         // Timestamp
}
```

### Shipment Collection

```javascript
{
  _id: ObjectId,
  trackingId: String,     // Required, unique (e.g., SHIP-1234567890-123)
  origin: String,         // Required, ≥5 chars
  destination: String,    // Required, ≥5 chars
  weight: Number,         // Required, positive
  carrier: String,        // Required, one of: FedEx, UPS, DHL, USPS
  status: String,         // "pending", "in-progress", "delivered", "cancelled"
  userId: ObjectId,       // Reference to User
  createdAt: Date,        // Timestamp
  updatedAt: Date         // Timestamp
}
```

## 🐛 Known Issues & Future Improvements

- [ ] Add rate limiting to prevent abuse
- [ ] Add request logging middleware
- [ ] Add email verification on signup
- [ ] Add password reset functionality
- [ ] Add pagination for large result sets
- [ ] Add query filtering and sorting options
- [ ] Add admin user management endpoints
- [ ] Add comprehensive integration tests
- [ ] Deploy to production (AWS/Heroku/DigitalOcean)

## 📚 Code Quality

This codebase follows these best practices:

✅ **MVC Architecture** — Clear separation of concerns
✅ **JSDoc Documentation** — Every function documented
✅ **Error Handling** — Centralized error middleware
✅ **Security** — bcrypt, Joi, JWT, .env
✅ **Code Style** — const/let, async/await, consistent formatting
✅ **Performance** — Optimized DB queries (populate, aggregation)

## 📄 License

ISC

## 👥 Support

For issues, questions, or contributions, please open an issue on GitHub.

---

**Last Updated:** January 2024  
**Version:** 2.0.0  
**Status:** ✅ Production Ready
```

## 📝 API Endpoints
The following routes are available (all under `/api`):

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Create a new account |
| POST | `/login` | Get your token |
| GET | `/shipments` | View your shipments |
| POST | `/shipments` | Create new shipment |
| PATCH | `/shipments/:id/status` | Update status (Admin) |

## 🚧 TODO List
We have some big plans for future updates:
- ✅ Improve database performance
- 📧 Add automated email alerts
- 🧪 Add unit tests for all routes
- 🛡️ Add more robust validation
- 📊 Dashboard frontend integration

---
### 🛠 Author
*Created with ❤️ by Senior Junior Developer*

##### 
**Note**: Please check with the lead developer if you have issues with the database connection.
