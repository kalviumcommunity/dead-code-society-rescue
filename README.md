# 🚚 LogiTrack API v1.0.0

Welcome to the **LogiTrack** backend! This is a secure, well-structured logistics and shipment tracking API built with Node.js, Express, and MongoDB.

## 📦 What is LogiTrack?
LogiTrack helps logistics teams manage shipments across the globe. It handles user authentication, shipment tracking, and role-based access control with a clean, maintainable architecture.

## 🛠 Features
- 🔐 **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- 👤 **User Management**: User registration, login, and profile management
- 📦 **Shipment Tracking**: Create, view, update, and delete shipments
- 🚫 **Role-Based Access Control**: Admin-only routes for sensitive operations
- ✅ **Input Validation**: Joi validation on all endpoints
- 🛡️ **Centralized Error Handling**: Custom error classes and error middleware
- � **Comprehensive Documentation**: JSDoc on all exported functions

## 🛠 Tech Stack

| Component | Technology |
|-----------|------------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB with Mongoose |
| Authentication | JWT (jsonwebtoken) |
| Password Hashing | bcrypt |
| Validation | Joi |
| Architecture | MVC (Model-View-Controller) |

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/kalviumcommunity/dead-code-society-rescue.git
cd dead-code-society-rescue
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Edit `.env` with your configuration:
```env
PORT=3000
DATABASE_URL=mongodb://localhost:27017/logitrack
JWT_SECRET=your_secure_secret_key_here
```

5. Start the development server:
```bash
npm run dev
```

Or start in production:
```bash
npm start
```

## 📝 Environment Variables

| Variable | Example | Required | Description |
|----------|---------|----------|-------------|
| PORT | 3000 | No | Server port (default: 3000) |
| DATABASE_URL | mongodb://localhost:27017/logitrack | Yes | MongoDB connection string |
| JWT_SECRET | super_secret_key | Yes | Secret key for JWT signing |

## 📝 API Reference

### Authentication

#### Register User
```http
POST /api/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### Login
```http
POST /api/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### Get Profile
```http
GET /api/profile
Authorization: Bearer <jwt_token>
```

### Shipments

#### Get All Shipments
```http
GET /api/shipments
Authorization: Bearer <jwt_token>
```

#### Get Single Shipment
```http
GET /api/shipments/:id
Authorization: Bearer <jwt_token>
```

#### Create Shipment
```http
POST /api/shipments
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "origin": "New York",
  "destination": "Los Angeles",
  "weight": 50,
  "carrier": "FedEx"
}
```

#### Update Shipment Status
```http
PATCH /api/shipments/:id/status
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "status": "delivered"
}
```

#### Delete Shipment
```http
DELETE /api/shipments/:id
Authorization: Bearer <jwt_token>
```

## 🏗 Architecture

```
src/
├── controllers/      # Request handlers
│   ├── auth.controller.js
│   └── shipment.controller.js
├── middlewares/      # Express middleware
│   ├── auth.middleware.js
│   ├── error.middleware.js
│   └── validate.middleware.js
├── models/          # Mongoose schemas
│   ├── User.js
│   └── Shipment.js
├── routes/          # Route definitions
│   ├── auth.routes.js
│   └── shipment.routes.js
├── services/        # Business logic
│   ├── auth.service.js
│   └── shipment.service.js
├── utils/           # Utility functions
│   ├── errors.util.js
│   └── jwt.util.js
├── validators/      # Joi validation schemas
│   ├── auth.validator.js
│   └── shipment.validator.js
├── app.js           # Express app setup
└── routes.js        # Route aggregation
```

## � Security Features

- **Password Hashing**: bcrypt with 12 rounds for secure password storage
- **JWT Authentication**: Token-based authentication with 12-hour expiration
- **Input Validation**: Joi validation on all POST/PUT/PATCH endpoints
- **Role-Based Access Control**: Admin-only routes for sensitive operations
- **Error Handling**: Centralized error handling to prevent information leakage

## 📊 Status Values

Shipments can have the following status values:
- `pending` - Initial status
- `in-progress` - Shipment is in transit
- `delivered` - Shipment has been delivered (admin only)
- `cancelled` - Shipment has been cancelled

## 🧪 Testing

To test the API, you can use:
- Postman
- curl
- Any HTTP client

Example curl command for registration:
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"securepassword123"}'
```

## 📄 License

ISC

## 👥 Contributing

This is a rescued codebase from the Dead Code Society project. For contributions, please refer to the original repository guidelines.
