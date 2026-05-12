# Dead Code Society Rescue - Logistics API

A production-ready backend API for shipment tracking and logistics management. Built with a clean 6-layer architecture, comprehensive security hardening, and optimized database queries.

## Overview

This API manages user accounts and shipment tracking with the following features:

- **User Management**: Registration, authentication with JWT, profile management
- **Shipment Tracking**: Create, read, update, and delete shipments with status tracking
- **Role-Based Access Control**: User and admin roles with permission checks
- **Query Optimization**: Eliminates N+1 database queries with intelligent population
- **Secure Authentication**: Bcrypt password hashing (12 rounds) + JWT tokens
- **Input Validation**: Joi schemas with NoSQL injection prevention
- **Centralized Error Handling**: Custom error classes with proper HTTP status codes
- **Request Logging**: Query debugging and performance monitoring utilities

## Tech Stack

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Runtime** | Node.js | 12+ | JavaScript runtime |
| **Framework** | Express.js | 4.x | HTTP server & routing |
| **Database** | MongoDB | 4.0+ | Document storage |
| **ODM** | Mongoose | 5.10+ | MongoDB schema & queries |
| **Authentication** | JWT (jsonwebtoken) | 8.5+ | Token-based auth |
| **Password Hashing** | bcrypt | 5.x | Secure password storage |
| **Validation** | Joi | 17.x+ | Schema validation |
| **Environment** | dotenv | 8.x+ | Config management |
| **Dev Tools** | Nodemon | 2.x+ | Auto-reload on changes |

## Quick Start

### Prerequisites
- Node.js 12+ and npm
- MongoDB 4.0+ (local or remote)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/dead-code-society-rescue.git
   cd dead-code-society-rescue
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**
   ```bash
   # Edit .env with your settings
   MONGO_URI=mongodb://localhost:27017/shipments
   JWT_SECRET=your-super-secret-key-here
   NODE_ENV=development
   PORT=3000
   ```

5. **Start the server**
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

6. **Verify it's running**
   ```bash
   curl http://localhost:3000/health
   ```

## Environment Variables

| Variable | Example | Required | Description |
|----------|---------|----------|-------------|
| `NODE_ENV` | `development` | Yes | Environment mode (development/production) |
| `PORT` | `3000` | No | HTTP server port (default: 3000) |
| `MONGO_URI` | `mongodb://localhost:27017/shipments` | Yes | MongoDB connection string |
| `JWT_SECRET` | `your-secret-key-min-32-chars` | Yes | Secret key for signing JWT tokens (min 32 chars in production) |
| `LOG_LEVEL` | `debug` | No | Logging level (debug/info/warn/error) |

**Security Notes:**
- Store `JWT_SECRET` in a secure location, never commit to version control
- Use strong, random secrets in production (minimum 32 characters)
- Rotate secrets periodically in production environments

## API Reference

### Authentication
| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| `POST` | `/api/auth/register` | No | Create new user account |
| `POST` | `/api/auth/login` | No | Authenticate user and get JWT token |
| `GET` | `/api/auth/profile` | Yes | Get current authenticated user's profile |

### Shipments
| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| `POST` | `/api/shipments` | Yes | Create new shipment |
| `GET` | `/api/shipments` | Yes | Get all shipments for authenticated user |
| `GET` | `/api/shipments/:id` | Yes | Get specific shipment by ID |
| `PATCH` | `/api/shipments/:id/status` | Yes | Update shipment status (admin required for 'delivered') |
| `DELETE` | `/api/shipments/:id` | Yes | Delete a shipment |

### Request Examples
**Register a new user:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```
**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```
**Create a shipment:**
```bash
curl -X POST http://localhost:3000/api/shipments \
  -H "Content-Type: application/json" \
  -H "Authorization: eyJhbGciOiJIUzI1NiIs..." \
  -d '{
    "origin": "New York",
    "destination": "Los Angeles",
    "weight": 25.5,
    "carrier": "FedEx"
  }'
```
**Get all shipments:**
```bash
curl -X GET http://localhost:3000/api/shipments \
  -H "Authorization: eyJhbGciOiJIUzI1NiIs..."
```
**Update shipment status:**
```bash
curl -X PATCH http://localhost:3000/api/shipments/60d5ec49c1234567890abcd/status \
  -H "Content-Type: application/json" \
  -H "Authorization: eyJhbGciOiJIUzI1NiIs..." \
  -d '{"status": "in-progress"}'
```

## Architecture

### 6-Layer Architecture
```
┌─────────────────────────────────────────────────────────┐
│                    ROUTES LAYER                         │
│    (Express Route Handlers, HTTP Endpoints)             │
│  /auth/register, /auth/login, /shipments, etc.          │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│               CONTROLLERS LAYER                         │
│    (Request/Response Handling, Parameter Extraction)    │
│    userController, shipmentController                   │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│              MIDDLEWARES LAYER                          │
│  (Auth, Validation, Error Handling, Logging)            │
│  authMiddleware, validation, errorHandler               │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│              SERVICES LAYER                             │
│    (Business Logic, Database Queries)                   │
│    userService, shipmentService                         │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│              MODELS LAYER                               │
│    (Mongoose Schemas, Database Structure)               │
│    User, Shipment                                       │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│         DATABASE LAYER (MongoDB)                        │
│    (Data Persistence, Collections)                      │
└─────────────────────────────────────────────────────────┘

UTILITIES (Cross-cutting concerns):
  - auth.js (bcrypt hashing, JWT signing)
  - errors.js (custom error classes)
  - response.js (response formatting)
  - queryDebug.js (query monitoring)
  - tracking.js (tracking ID generation)
  - constants.js (enums and constants)
```

### Data Flow
```
HTTP Request
    │
    ├─→ Route Handler
    │     │
    │     ├─→ Validation Middleware (Joi schemas)
    │     │     ├─ Validates request body
    │     │     └─ Strips unknown fields (NoSQL injection prevention)
    │     │
    │     ├─→ Auth Middleware (if protected)
    │     │     ├─ Verifies JWT token
    │     │     └─ Attaches userId/userRole to request
    │     │
    │     ├─→ Controller
    │     │     ├─ Extracts parameters
    │     │     └─ Calls service layer
    │     │
    │     ├─→ Service
    │     │     ├─ Applies business logic
    │     │     ├─ Queries database
    │     │     └─ Logs queries for performance
    │     │
    │     ├─→ Model (Mongoose)
    │     │     └─ Interacts with MongoDB
    │     │
    │     ├─→ Error Handler (if error)
    │     │     ├─ Catches errors from service
    │     │     └─ Formats error response
    │     │
    │     └─→ Response Formatter
    │           └─ Wraps data in success envelope
    │
    └─→ JSON Response
```

## Key Features

### Security Hardening ✅
- **Password Hashing**: Bcrypt with 12 rounds (resistant to brute force)
- **JWT Authentication**: 12-hour token expiration
- **Input Validation**: Joi schemas with NoSQL injection prevention
- **Role-Based Access Control**: User and admin permission checks
- **Secure Tracking IDs**: Cryptographically secure (not Math.random())

### Performance Optimization ✅
- **N+1 Query Elimination**: Uses `.populate()` for efficient joins
  - 10 shipments: 91% query reduction (11 → 1 query)
  - 100 shipments: 99% query reduction (101 → 1 query)
  - 1000+ shipments: 99.9% query reduction
- **Query Debugging**: Built-in monitoring to track database performance
- **Selective Field Population**: Only fetches required user fields (name, email)

### Code Quality ✅
- **Clean Architecture**: 6-layer separation of concerns
- **Error Handling**: Centralized middleware with custom error classes
- **JSDoc Documentation**: All exports documented with @param, @returns, @throws
- **Modern JavaScript**: Async/await (not callbacks), const/let (not var)
- **Constants Management**: Centralized enum definitions

## Project Structure
```
dead-code-society-rescue/
├── src/
│   ├── models/
│   │   ├── User.js              # Mongoose User schema
│   │   └── Shipment.js          # Mongoose Shipment schema
│   │
│   ├── routes/
│   │   ├── index.js             # Route aggregator
│   │   ├── auth.js              # Auth endpoints
│   │   ├── shipments.js         # Shipment endpoints
│   │   └── health.js            # Health check
│   │
│   ├── controllers/
│   │   ├── userController.js    # Auth request handlers
│   │   └── shipmentController.js # Shipment request handlers
│   │
│   ├── services/
│   │   ├── userService.js       # User business logic
│   │   └── shipmentService.js   # Shipment business logic
│   │
│   ├── middlewares/
│   │   ├── authMiddleware.js    # JWT verification
│   │   ├── validation.js        # Joi validation
│   │   └── errorHandler.js      # Centralized error handling
│   │
│   ├── validators/
│   │   ├── userValidator.js     # User Joi schemas
│   │   └── shipmentValidator.js # Shipment Joi schemas
│   │
│   ├── utils/
│   │   ├── auth.js              # Bcrypt & JWT utilities
│   │   ├── errors.js            # Custom error classes
│   │   ├── response.js          # Response formatting
│   │   ├── queryDebug.js        # Query monitoring
│   │   ├── queryTest.js         # Query testing utilities
│   │   ├── tracking.js          # Tracking ID generation
│   │   └── constants.js         # Enums and constants
│   │
│   └── app.js                   # Express app setup
│
├── AUDIT.md                     # Code smell documentation
├── CHANGELOG.md                 # All changes and improvements
├── README.md                    # This file
├── package.json                 # Dependencies
└── .env.example                 # Environment template
```

## Error Handling
The API uses HTTP status codes to indicate errors:
| Status | Error | Description |
|--------|-------|-------------|
| `400` | ValidationError | Request data fails validation |
| `401` | UnauthorizedError | Missing or invalid authentication token |
| `403` | ForbiddenError | Insufficient permissions for operation |
| `404` | NotFoundError | Requested resource does not exist |
| `409` | ConflictError | Operation conflicts with existing data |
| `422` | UnprocessableError | Request cannot be processed |
| `500` | AppError | Internal server error |

**Example Error Response:**
```json
{
  "success": false,
  "error": {
    "name": "ValidationError",
    "message": "Validation failed",
    "errors": [
      "\"email\" must be a valid email",
      "\"password\" length must be at least 6 characters"
    ]
  }
}
```

## Testing

### Manual Testing with Query Monitoring

```javascript
const queryTest = require('./src/utils/queryTest');
const shipmentService = require('./src/services/shipmentService');
// Test with query logging
await queryTest.testWithQueryLogging('Fetch 10 shipments', async () => {
    await shipmentService.getUserShipments(userId);
});
// Compare before/after optimization
await queryTest.compareQueryCounts(
    'Shipment fetch optimization',
    async () => { /* old code */ },
    async () => { /* optimized code */ }
);
```

## Development

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
```

### Development Mode (Auto-reload)
```bash
npm run dev
```

## License
MIT

## Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Support
For issues and questions, please open a GitHub issue or contact the maintainers.