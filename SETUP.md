# LogiTrack Backend - Setup & Development Guide

**Status:** Refactored and secured. Ready for deployment.  
**Last Updated:** May 12, 2026  
**Previous State:** 600-line flat file with security vulnerabilities  
**Current State:** Clean MVC architecture with bcrypt security

---

## Quick Start (5 minutes)

### 1. Clone and Setup

```bash
git clone https://github.com/kalviumcommunity/dead-code-society-rescue.git
cd dead-code-society-rescue
git checkout -b dev/your-feature
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with required values:

```env
# MongoDB connection string (required)
DATABASE_URL=mongodb://localhost:27017/logitrack

# JWT secret for token signing (required - use strong random value)
JWT_SECRET=your-super-secret-key-here-minimum-32-chars

# Server port (optional, defaults to 3000)
PORT=3000
```

**⚠️ Critical:** Never commit `.env` file. It contains secrets.

### 4. Start Development Server

```bash
npm run dev
```

Server runs on `http://localhost:3000`

### 5. Test It Works

```bash
curl http://localhost:3000
# Expected response: { "message": "LogiTrack Backend running" }
```

---

## Environment Variables

**Required:**

| Variable       | Description                                             | Example                               |
| -------------- | ------------------------------------------------------- | ------------------------------------- |
| `DATABASE_URL` | MongoDB connection string                               | `mongodb://localhost:27017/logitrack` |
| `JWT_SECRET`   | Secret for signing JWT tokens. Use strong random value. | `your-32-char-secret-key-minimum`     |

**Optional:**

| Variable | Description | Default |
| -------- | ----------- | ------- |
| `PORT`   | Server port | `3000`  |

**Security Notes:**

- `JWT_SECRET` must be at least 32 characters for production
- Never hardcode secrets in code
- Rotate `JWT_SECRET` periodically for high-security environments
- Use environment variable injection for production

---

## Project Structure

```
src/
├── app.js                      # Express app setup, database connection
├── routes/                     # URL routing layer
│   ├── authRoutes.js          # /api/auth/* endpoints
│   ├── shipmentRoutes.js      # /api/shipments/* endpoints
│   └── healthRoutes.js        # /api/health, /api/status endpoints
├── controllers/               # HTTP request handlers
│   ├── userController.js      # Register, login, profile logic
│   └── shipmentController.js  # Shipment CRUD handlers
├── services/                  # Business logic & database queries
│   ├── userService.js         # User authentication & profile
│   └── shipmentService.js     # Shipment operations, N+1 prevention
├── models/                    # Mongoose schemas
│   ├── User.js               # User schema
│   └── Shipment.js           # Shipment schema
├── middlewares/               # Express middlewares
│   ├── auth.js               # JWT authentication middleware
│   └── errorHandler.js       # Global error handler
└── utils/                     # Shared utilities
    ├── hash.js               # bcrypt password hashing
    ├── jwt.js                # JWT token generation & verification
    ├── validation.js         # Input validation & sanitization
    └── response.js           # Standardized HTTP responses
```

**Architecture Layers:**

1. **Routes** → Receive HTTP requests, map to controllers
2. **Controllers** → Parse req, call services, send responses
3. **Services** → Business logic, database queries, authorization checks
4. **Models** → MongoDB Mongoose schemas only
5. **Middlewares** → Auth, error handling
6. **Utils** → Shared functions: hashing, JWT, validation, responses

---

## API Endpoints

### Authentication (`/api/auth`)

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2026-05-12T10:30:00Z"
    }
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

**Response (200):**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

#### Get Profile

```http
GET /api/auth/profile
Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2026-05-12T10:30:00Z"
    }
  }
}
```

---

### Shipments (`/api/shipments`)

**All shipment endpoints require JWT authentication.**

#### Create Shipment

```http
POST /api/shipments
Authorization: <jwt-token>
Content-Type: application/json

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
    "shipment": {
      "_id": "507f1f77bcf86cd799439012",
      "trackingId": "SHIP-1715509800000-4521",
      "origin": "New York",
      "destination": "Los Angeles",
      "weight": 25.5,
      "carrier": "FedEx",
      "status": "pending",
      "userId": "507f1f77bcf86cd799439011",
      "createdAt": "2026-05-12T10:30:00Z",
      "updatedAt": "2026-05-12T10:30:00Z"
    }
  }
}
```

#### List User's Shipments

```http
GET /api/shipments
Authorization: <jwt-token>
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "shipments": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "trackingId": "SHIP-1715509800000-4521",
        "origin": "New York",
        "destination": "Los Angeles",
        "weight": 25.5,
        "carrier": "FedEx",
        "status": "pending",
        "userId": {
          "_id": "507f1f77bcf86cd799439011",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "createdAt": "2026-05-12T10:30:00Z"
      }
    ]
  }
}
```

#### Get Single Shipment

```http
GET /api/shipments/{shipmentId}
Authorization: <jwt-token>
```

#### Update Shipment Status

```http
PATCH /api/shipments/{shipmentId}/status
Authorization: <jwt-token>
Content-Type: application/json

{
  "status": "in-progress"
}
```

**Valid Statuses:** `pending`, `in-progress`, `delivered`, `cancelled`

**Note:** Only admins can mark shipments as `delivered`.

#### Delete Shipment

```http
DELETE /api/shipments/{shipmentId}
Authorization: <jwt-token>
```

---

### Health Check (`/api`)

#### Simple Health Check

```http
GET /api/health
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "status": "Server is running"
  }
}
```

#### Detailed Status

```http
GET /api/status
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "uptime": 3600,
    "memory": {
      "rss": 52000000,
      "heapTotal": 15000000,
      "heapUsed": 8000000
    },
    "os": {
      "platform": "darwin",
      "arch": "arm64",
      "cpus": 8
    },
    "timestamp": "2026-05-12T10:30:00Z"
  }
}
```

---

## What Changed (Audit Summary)

See [AUDIT.md](AUDIT.md) for detailed findings.

### Security Fixes

**Critical Issues Resolved:**

- ✓ Replaced MD5 with **bcrypt** (12 rounds minimum)
- ✓ Added **input validation** to prevent NoSQL injection
- ✓ Fixed **authorization bypass** in DELETE endpoint
- ✓ Added **permission checks** to all operations
- ✓ Secure **JWT token** generation and verification

### Code Quality

**Refactoring Done:**

- ✓ Replaced all `var` with `const`/`let`
- ✓ Converted promise chains to `async/await`
- ✓ Eliminated **N+1 queries** using `.populate()`
- ✓ Extracted duplicated auth logic to middleware
- ✓ Standardized HTTP response format
- ✓ Added comprehensive error handling
- ✓ Added JSDoc comments to all functions
- ✓ Removed unused imports

**Metrics:**

- **Before:** 600 lines in one file, 16 code smells
- **After:** Clean MVC, 4 layers, fully documented
- **Security:** 6 critical issues fixed
- **Performance:** N+1 queries eliminated

---

## Development Workflow

### Running the App

```bash
npm run dev
```

Uses `nodemon` for automatic restart on file changes.

### Making Changes

1. Always work on a feature branch:

   ```bash
   git checkout -b feature/your-feature
   ```

2. Follow the MVC structure:
   - New endpoint? Create route → controller → service
   - New validation? Add to `src/utils/validation.js`
   - New utility? Add to `src/utils/`
   - New middleware? Add to `src/middlewares/`

3. Add JSDoc comments to all functions

4. Test your changes with curl or Postman

5. Commit with clear message:
   ```bash
   git commit -m "feat: add shipment tracking status notifications"
   ```

### Common Tasks

#### Add a New Endpoint

1. Create controller method in `src/controllers/`
2. Add route in `src/routes/`
3. Create service method if needed
4. Add validation in `src/utils/validation.js`
5. Document in this README

#### Fix a Bug

1. Reproduce in postman
2. Check service layer logic first
3. Fix at the appropriate layer
4. Test all affected endpoints

#### Optimize a Query

1. Check `src/services/` for database calls
2. Use `.populate()` for related documents instead of loops
3. Add `.select()` to exclude unnecessary fields
4. Test with multiple records

---

## Debugging Tips

### Enable Detailed Logging

Currently, errors are logged to console. For production, consider:

- Winston logger with file rotation
- Sentry for error tracking
- CloudWatch for AWS deployments

### Common Issues

**"JWT_SECRET not configured"**

- Ensure `.env` has `JWT_SECRET` set
- Server won't start without it

**"Cannot connect to MongoDB"**

- Check `DATABASE_URL` in `.env`
- Ensure MongoDB is running
- Verify connection string format

**"Email already registered"**

- User with that email exists
- Test with different email address

**"Unauthorized: Invalid token"**

- Token has expired (12h limit)
- Token is malformed
- Try logging in again

---

## Performance Notes

### N+1 Query Prevention

✓ **Implemented:** Shipment list uses `.populate('userId')` to fetch user in one query.

### Query Optimization

- Shipment list only fetches `name` and `email` from User
- User profile excludes password from response
- Use `.select()` to limit fields

### Database Indexes

Recommended indexes (add to MongoDB):

```javascript
db.users.createIndex({ email: 1 }, { unique: true });
db.shipments.createIndex({ userId: 1 });
db.shipments.createIndex({ trackingId: 1 }, { unique: true });
db.shipments.createIndex({ createdAt: -1 });
```

---

## Testing

No automated tests yet. Manual testing with curl or Postman recommended.

### Test Workflow

```bash
# 1. Register a user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Test123456"}'

# 2. Login and get token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123456"}'

# 3. Create shipment (use token from login)
curl -X POST http://localhost:3000/api/shipments \
  -H "Authorization: YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"origin":"NY","destination":"LA","weight":25,"carrier":"FedEx"}'

# 4. List shipments
curl http://localhost:3000/api/shipments \
  -H "Authorization: YOUR_TOKEN_HERE"
```

---

## Deployment

### Prerequisites

- Node.js 14+ (ideally 16+)
- MongoDB 4.0+
- Environment variables configured

### Before Deploying

1. Run security audit: `npm audit`
2. Test all endpoints with Postman collection
3. Verify environment variables are set
4. Check database connection works

### Production Checklist

- [ ] `JWT_SECRET` is strong (32+ characters, random)
- [ ] `NODE_ENV=production`
- [ ] Database has proper indexes
- [ ] Backups configured
- [ ] Monitoring/alerting set up
- [ ] HTTPS enabled (reverse proxy)
- [ ] CORS configured for frontend origin
- [ ] Rate limiting enabled (if needed)

---

## Future Improvements

From AUDIT.md, recommended next steps:

1. Add automated tests (Jest + Supertest)
2. Add rate limiting middleware
3. Add request logging (Morgan)
4. Add email notifications for shipment updates
5. Add role-based access control (RBAC) for admin endpoints
6. Implement shipment status update webhooks
7. Add database transaction support
8. Implement caching layer (Redis)
9. Add API documentation (Swagger/OpenAPI)
10. Add comprehensive audit logging

---

## Support

### Getting Help

1. Check [AUDIT.md](AUDIT.md) for known issues
2. Review error messages in logs
3. Check endpoint documentation in this file
4. Review service layer code for business logic

### Reporting Issues

Include:

- Endpoint called
- Request body
- Response received
- MongoDB connection string (no password!)
- Error message from logs

---

**Last Updated:** May 12, 2026  
**Status:** Production Ready ✓
