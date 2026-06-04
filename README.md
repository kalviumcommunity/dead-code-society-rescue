# LogiTrack Backend

## Overview

LogiTrack is a modern Node.js backend application for logistics and shipment tracking. It provides a secure, scalable REST API for managing user accounts and shipment information with role-based access control.

## Tech Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Runtime | Node.js | 14+ |
| Framework | Express.js | 4.17+ |
| Database | MongoDB | 4.0+ |
| Authentication | JWT | jsonwebtoken 8.5+ |
| Password Hashing | bcrypt | 5.0+ |
| Input Validation | Joi | 17.0+ |
| CORS | cors | 2.8+ |

## Quick Start

### Prerequisites
- Node.js 14+ installed
- MongoDB server running locally or a MongoDB Atlas connection string
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dead-code-society-rescue
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   Create a `.env` file in the project root:
   ```
   DATABASE_URL=mongodb://localhost:27017/logitrack
   PORT=3000
   JWT_SECRET=your-secret-key-min-32-chars
   NODE_ENV=development
   ```

4. **Start the server**
   ```bash
   # Development (with auto-reload)
   npm run dev

   # Production
   npm start
   ```

   The API will be available at `http://localhost:3000`

## Environment Variables

| Variable | Example | Required | Description |
|----------|---------|----------|-------------|
| `DATABASE_URL` | `mongodb://localhost:27017/logitrack` | Yes | MongoDB connection string |
| `PORT` | `3000` | No | Server port (default: 3000) |
| `JWT_SECRET` | `your-secret-key-min-32-chars` | Yes | Secret key for JWT signing (min 32 chars) |
| `NODE_ENV` | `development` | No | Environment (development/production) |

## API Reference

### Authentication Endpoints

#### Register User
- **POST** `/auth/register`
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123",
    "role": "user"
  }
  ```
- **Response:** 201 Created
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": { "user_object" }
  }
  ```
- **Auth Required:** No

#### Login User
- **POST** `/auth/login`
- **Request Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "securepassword123"
  }
  ```
- **Response:** 200 OK
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user": { "user_object" },
      "token": "eyJhbGci..."
    }
  }
  ```
- **Auth Required:** No

#### Get User Profile
- **GET** `/auth/profile`
- **Response:** 200 OK
  ```json
  {
    "success": true,
    "message": "Profile retrieved",
    "data": { "user_object" }
  }
  ```
- **Auth Required:** Yes

### Shipment Endpoints

#### Create Shipment
- **POST** `/api/shipments`
- **Request Body:**
  ```json
  {
    "origin": "New York",
    "destination": "Los Angeles",
    "weight": 50,
    "carrier": "FedEx"
  }
  ```
- **Response:** 201 Created
- **Auth Required:** Yes

#### Get All User Shipments
- **GET** `/api/shipments`
- **Response:** 200 OK with array of shipments
- **Auth Required:** Yes

#### Get Specific Shipment
- **GET** `/api/shipments/:id`
- **Response:** 200 OK with shipment details
- **Auth Required:** Yes (owner or admin)

#### Update Shipment Status
- **PATCH** `/api/shipments/:id/status`
- **Request Body:**
  ```json
  {
    "status": "delivered"
  }
  ```
- **Valid Statuses:** pending, in-progress, delivered, cancelled
- **Response:** 200 OK with updated shipment
- **Auth Required:** Yes (admin only for "delivered")

#### Delete Shipment
- **DELETE** `/api/shipments/:id`
- **Response:** 200 OK
- **Auth Required:** Yes (owner or admin)

## Architecture

### Directory Structure

```
src/
├── app.js                    # Express app setup
├── controllers/              # HTTP request handlers
│   ├── user.controller.js
│   └── shipment.controller.js
├── services/                 # Business logic
│   ├── user.service.js
│   └── shipment.service.js
├── routes/                   # Route definitions
│   ├── user.routes.js
│   └── shipment.routes.js
├── middlewares/              # Custom middlewares
│   ├── auth.middleware.js    # JWT verification
│   ├── error.middleware.js   # Global error handling
│   └── validation.middleware.js # Joi validation
├── utils/                    # Helper utilities
│   ├── errors.util.js        # Custom error classes
│   ├── response.util.js      # Response formatting
│   └── constants.util.js     # App constants
└── validators/               # Input validation schemas
    └── schemas.validator.js  # Joi schemas

models/                        # Mongoose schemas
├── User.js
└── Shipment.js
```

### Architecture Diagram

```
┌─────────────────────────────────────────┐
│         HTTP Request/Response           │
└────────────────┬────────────────────────┘
                 │
        ┌────────▼────────┐
        │  Validation     │
        │  Middleware     │
        └────────┬────────┘
                 │
        ┌────────▼────────┐
        │  Auth           │
        │  Middleware     │
        └────────┬────────┘
                 │
        ┌────────▼────────┐
        │  Route Handler  │
        │  (Controllers)  │
        └────────┬────────┘
                 │
        ┌────────▼────────┐
        │  Services       │
        │  (Business      │
        │   Logic)        │
        └────────┬────────┘
                 │
        ┌────────▼────────┐
        │  Models/DB      │
        │  (MongoDB)      │
        └─────────────────┘

         Error Handler
         (Centralized)
```

## Security Features

- **Password Hashing:** bcrypt with 12 rounds
- **JWT Authentication:** Token-based auth with 12-hour expiry
- **Input Validation:** Joi schemas for all endpoints
- **Authorization:** Role-based access control (admin/user)
- **Error Handling:** Centralized error middleware
- **NoSQL Injection Prevention:** Parameterized queries via Mongoose

## Development

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
```

### Database Migration
```bash
npm run db:migrate
```

## Performance Optimizations

- **N+1 Query Prevention:** Using Mongoose `.populate()` for related data
- **Async/Await:** Modern async patterns for cleaner code
- **Error Handling:** Centralized middleware eliminates duplicate catch blocks
- **Connection Pooling:** Mongoose handles connection optimization

## Deployment

### Production Checklist

1. Set strong `JWT_SECRET` in environment
2. Configure MongoDB for production (replication, backups)
3. Enable CORS for allowed origins only
4. Set `NODE_ENV=production`
5. Use HTTPS for all connections
6. Monitor error logs and performance

### Deployment Platforms

- **Docker:** See Dockerfile (if provided)
- **Heroku:** `git push heroku main`
- **AWS:** Deploy via Elastic Beanstalk or EC2
- **Azure:** Deploy via App Service

## Troubleshooting

| Issue | Solution |
|-------|----------|
| MongoDB connection fails | Check `DATABASE_URL` and MongoDB service is running |
| JWT token rejected | Verify `JWT_SECRET` matches and token hasn't expired |
| CORS errors | Ensure `CORS_ORIGIN` env var is correctly configured |
| Password auth fails | Verify bcrypt is installed and working correctly |

## Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/my-feature`
4. Submit a pull request

## License

ISC

## Support

For issues or questions, please create a GitHub issue or contact the development team.

---

**Last Updated:** June 4, 2026  
**Status:** Refactored to MVC Architecture
