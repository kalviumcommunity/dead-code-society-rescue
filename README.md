# LogiTrack — Shipment Tracking Backend

> REST API for tracking shipments built with Node.js, Express, and MongoDB.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express 4 |
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken) |
| Validation | Joi |
| Hashing | bcrypt |

## Quick Start

# 1. Clone and install
git clone https://github.com/kalviumcommunity/dead-code-society-rescue.git
cd dead-code-society-rescue
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env and fill in DATABASE_URL and JWT_SECRET

# 3. Start MongoDB locally
mongod --dbpath ./data

# 4. Start the dev server
npm run dev

## Environment Variables

| Variable | Example | Required | Description |
|----------|---------|----------|-------------|
| PORT | 3000 | Yes | Server port |
| DATABASE_URL | mongodb://localhost:27017/logitrack | Yes | MongoDB connection string |
| JWT_SECRET | some-long-random-string-min-32-chars | Yes | JWT signing secret (min 32 chars) |
| NODE_ENV | development | No | development or production |

## API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/register | No | Register new user |
| POST | /api/login | No | Login, receive JWT |
| GET | /api/profile | Yes | Get current user profile |
| GET | /api/shipments | Yes | List my shipments |
| POST | /api/shipments | Yes | Create shipment |
| GET | /api/shipments/:id | Yes | Get single shipment |
| PATCH | /api/shipments/:id/status | Yes | Update status (admin only for 'delivered') |
| DELETE | /api/shipments/:id | Yes | Delete shipment |
| GET | / | No | Welcome message |
| GET | /ping | No | Health check |

## Architecture

```
Request
  └─► Router (routes/)
        └─► Controller (controllers/)
              └─► Service (services/)
                    └─► Model (models/)
                          └─► MongoDB
```

### Folder Structure

```
src/
├── routes/
│   ├── auth.routes.js
│   ├── user.routes.js
│   └── shipment.routes.js
├── controllers/
│   ├── auth.controller.js
│   ├── user.controller.js
│   └── shipment.controller.js
├── services/
│   ├── auth.service.js
│   ├── user.service.js
│   └── shipment.service.js
├── models/
│   ├── User.model.js
│   └── Shipment.model.js
├── middlewares/
│   ├── auth.middleware.js
│   ├── validate.middleware.js
│   ├── error.middleware.js
│   └── notFound.middleware.js
├── validators/
│   ├── auth.validator.js
│   └── shipment.validator.js
├── utils/
│   ├── errors.util.js
│   ├── jwt.util.js
│   └── hash.util.js
└── server.js
```

## Security Features

- **bcrypt** password hashing with 12 salt rounds
- **Joi** input validation on all request bodies
- **JWT** token-based authentication
- **Centralized error handling** to prevent information leakage
- **NoSQL injection prevention** through input sanitization

## Example Usage

### Register a User
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### Create a Shipment (requires JWT)
```bash
curl -X POST http://localhost:3000/api/shipments \
  -H "Content-Type: application/json" \
  -H "Authorization: YOUR_JWT_TOKEN" \
  -d '{
    "origin": "New York, NY",
    "destination": "Los Angeles, CA",
    "weight": 5.5,
    "carrier": "FedEx"
  }'
```
