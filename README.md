# LogiTrack Backend API

> REST API for shipment tracking and logistics management. Built with Node.js, Express, MongoDB, and bcrypt security.

## Features

- **Secure Authentication** - JWT tokens with bcrypt password hashing (12 salt rounds)
- **Input Validation** - Joi schema validation on all request bodies with NoSQL injection prevention
- **Database Optimization** - Mongoose populate() to eliminate N+1 query problems
- **Error Handling** - Centralized error middleware with custom error classes
- **Clean Architecture** - MVC pattern with clear separation of concerns
- **Full Documentation** - JSDoc on all functions + complete API reference

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Runtime** | Node.js | 20+ |
| **Framework** | Express | 4.x |
| **Database** | MongoDB + Mongoose | 7.x |
| **Authentication** | JWT (jsonwebtoken) | 9.x |
| **Password Hashing** | bcrypt | 5.x |
| **Input Validation** | Joi | 17.x |
| **Dev Tools** | nodemon | 3.x |

## Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/your-org/logitrack.git
cd logitrack
npm install
```

### 2. Set Up Environment

```bash
cp .env.example .env
```

Edit `.env` and fill in:
```env
PORT=3000
DATABASE_URL=mongodb://localhost:27017/logitrack
JWT_SECRET=your-secret-key-min-32-chars-long
NODE_ENV=development
```

### 3. Start MongoDB

```bash
# Using MongoDB community
mongod --dbpath ./data

# Or using Docker
docker run -d -p 27017:27017 mongo:latest
```

### 4. Start the Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server will be running on `http://localhost:3000`

## Environment Variables

| Variable | Example | Required | Description |
|----------|---------|----------|-------------|
| `PORT` | `3000` | Yes | Server port |
| `DATABASE_URL` | `mongodb://localhost:27017/logitrack` | Yes | MongoDB connection string |
| `JWT_SECRET` | `your-secret-key-min-32-chars` | Yes | Secret for signing JWT tokens (min 32 chars) |
| `NODE_ENV` | `development` | Yes | Environment mode (development, production, test) |

## API Reference

### Authentication Endpoints

#### Register New User
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}

Response: 201 Created
{
  "success": true,
  "message": "Account created!",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response: 200 OK
{
  "msg": "Login OK",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "name": "John Doe",
    "email": "user@example.com",
    "role": "user"
  }
}
```

### Shipment Endpoints

All shipment endpoints require `Authorization: <JWT_TOKEN>` header.

#### List All Shipments
```
GET /api/shipments
Authorization: <JWT_TOKEN>

Response: 200 OK
{
  "status": "success",
  "results": 2,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "trackingId": "SHIP-1715000000000-42",
      "origin": "New York",
      "destination": "Los Angeles",
      "status": "in-progress",
      "weight": 15.5,
      "carrier": "FedEx",
      "user_details": {
        "_id": "507f1f77bcf86cd799439010",
        "name": "John Doe",
        "email": "user@example.com",
        "role": "user"
      }
    }
  ]
}
```

#### Get Single Shipment
```
GET /api/shipments/:id
Authorization: <JWT_TOKEN>

Response: 200 OK
{ ...shipment object... }
```

#### Create Shipment
```
POST /api/shipments
Authorization: <JWT_TOKEN>
Content-Type: application/json

{
  "origin": "New York",
  "destination": "Los Angeles",
  "carrier": "FedEx",
  "weight": 15.5
}

Response: 201 Created
{ ...created shipment object... }
```

#### Update Shipment Status
```
PATCH /api/shipments/:id/status
Authorization: <JWT_TOKEN>
Content-Type: application/json

{
  "status": "delivered"
}

Response: 200 OK
{ ...updated shipment object... }
```

Status values: `pending`, `in-progress`, `delivered`, `cancelled`
(Only admins can set status to `delivered`)

#### Delete Shipment
```
DELETE /api/shipments/:id
Authorization: <JWT_TOKEN>

Response: 200 OK
{
  "success": true,
  "message": "Deleted 507f1f77bcf86cd799439011"
}
```

### User Endpoints

#### Get Current User Profile
```
GET /api/users/profile
Authorization: <JWT_TOKEN>

Response: 200 OK
{
  "_id": "507f1f77bcf86cd799439010",
  "name": "John Doe",
  "email": "user@example.com",
  "role": "user",
  "createdAt": "2024-05-05T10:30:00Z"
}
```

## Architecture

```
Request
  ↓
Routes (auth.routes.js, shipment.routes.js, user.routes.js)
  ↓
Auth Middleware (verifies JWT token)
  ↓
Validation Middleware (Joi schema validation)
  ↓
Controllers (auth.controller.js, shipment.controller.js, user.controller.js)
  ↓
Services (auth.service.js, shipment.service.js, user.service.js)
  ↓
Models (User.js, Shipment.js via Mongoose)
  ↓
MongoDB Database
```

## Project Structure

```
src/
├── app.js                 # Express app setup
├── routes/
│   ├── index.js          # Route aggregator
│   ├── auth.routes.js    # Auth endpoints
│   ├── shipment.routes.js # Shipment endpoints
│   └── user.routes.js    # User endpoints
├── controllers/
│   ├── auth.controller.js
│   ├── shipment.controller.js
│   └── user.controller.js
├── services/
│   ├── auth.service.js      # Auth logic (register, login)
│   ├── shipment.service.js  # Shipment business logic
│   └── user.service.js      # User logic
├── models/
│   ├── User.js              # User schema
│   └── Shipment.js          # Shipment schema
├── middlewares/
│   ├── auth.middleware.js    # JWT verification
│   ├── validate.middleware.js # Joi validation
│   └── error.middleware.js   # Centralized error handling
├── validators/
│   ├── auth.validators.js
│   └── shipment.validators.js
└── utils/
    ├── jwt.util.js          # JWT helpers
    ├── hash.util.js         # Password hashing (bcrypt)
    ├── errors.util.js       # Custom error classes
    └── response.util.js     # Response formatting
```

## Security Features

- **Passwords**: bcrypt with 12 salt rounds (makes brute-force attacks infeasible)
- **Input Validation**: Joi schema validation sanitizes all inputs
- **Unknown Field Stripping**: Extra fields removed before DB operations (NoSQL injection prevention)
- **JWT Tokens**: Signed with secret, expire after 12 hours
- **Error Handling**: Generic messages in production (no info leakage)
- **Permission Checks**: Only owners/admins can access/modify shipments

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": "ErrorType",
  "message": "Human readable error message"
}
```

HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation failed)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (no permission)
- `404` - Not Found
- `409` - Conflict (resource already exists)
- `422` - Validation Error
- `500` - Internal Server Error

## Performance Optimizations

✅ **N+1 Query Fix**: Mongoose `.populate()` reduces 101 queries to 2
✅ **Connection Pooling**: MongoDB connection reuse
✅ **Async/Await**: Non-blocking operations throughout
✅ **Input Validation**: Prevents invalid data from reaching DB

## Testing

Run the health check:
```bash
curl http://localhost:3000/
# { "message": "LogiTrack Backend running" }
```

Test registration:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!",
    "name": "Test User"
  }'
```

## Development

### Available Scripts

```bash
npm run dev      # Start development server (with auto-reload)
npm start        # Start production server
npm run lint     # Run ESLint (if configured)
npm test         # Run tests (if configured)
```

### Adding New Routes

1. Create a new route file in `src/routes/`
2. Create a controller in `src/controllers/`
3. Create a service in `src/services/` for business logic
4. Add validators in `src/validators/` if needed
5. Import and register in `src/routes/index.js`

### Best Practices

- Keep controllers thin (just request/response handling)
- Put all business logic in services
- Use async/await, not .then() chains
- Throw custom error classes, not generic errors
- Always validate input with Joi
- Use `.populate()` to avoid N+1 queries

## 📄 License

MIT

## Author

Built by the LogiTrack Team

## 🤝 Contributing

Contributions are welcome! Please read CONTRIBUTING.md for guidelines.

---

**For detailed changes, see [CHANGELOG.md](CHANGELOG.md)**

Happy shipping!
