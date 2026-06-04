# LogiTrack Backend

A REST API for tracking shipments for small businesses. Built with Node.js, Express, and MongoDB.

---

## Tech Stack

| Layer        | Technology              |
|--------------|-------------------------|
| Runtime      | Node.js 14+             |
| Framework    | Express 4               |
| Database     | MongoDB via Mongoose 5  |
| Auth         | JSON Web Tokens (JWT)   |
| Validation   | Joi 17                  |
| Password     | bcrypt (12 rounds)      |

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/kalviumcommunity/dead-code-society-rescue.git
cd dead-code-society-rescue

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Open .env and fill in DATABASE_URL and JWT_SECRET

# 4. Run
npm run dev
```

The server starts on `http://localhost:3000` by default.

---

## Environment Variables

| Variable       | Example                            | Required | Description                                              |
|----------------|------------------------------------|----------|----------------------------------------------------------|
| `PORT`         | `3000`                             | No       | Port the server listens on. Defaults to 3000.            |
| `DATABASE_URL` | `mongodb://localhost:27017/logitrack` | **Yes** | Full MongoDB connection string.                          |
| `JWT_SECRET`   | `a-long-random-string`             | **Yes**  | Secret for signing JWTs. Server refuses to start without it. |
| `JWT_EXPIRES_IN` | `12h`                            | No       | Token expiry duration. Defaults to `12h`.                |

---

## Folder Structure

```
src/
├── app.js                    Entry point — wires Express, DB, routes, error handler
├── routes/
│   ├── auth.routes.js        URL definitions for /api/auth/*
│   └── shipment.routes.js    URL definitions for /api/shipments/*
├── controllers/
│   ├── auth.controller.js    Reads req, calls service, sends res
│   └── shipment.controller.js
├── services/
│   ├── auth.service.js       All auth business logic (register, login, profile)
│   └── shipment.service.js   All shipment business logic (CRUD, N+1 fix, authz)
├── models/
│   ├── User.js               Mongoose schema for users
│   └── Shipment.js           Mongoose schema for shipments
├── middlewares/
│   ├── auth.middleware.js    JWT verification — sets req.userId / req.userRole
│   ├── validate.middleware.js Joi validation factory — strips unknown fields
│   └── errorHandler.middleware.js Centralized error handler (last app.use)
├── validators/
│   ├── auth.validator.js     Joi schemas for register and login
│   └── shipment.validator.js Joi schemas for create shipment and update status
└── utils/
    ├── errors.util.js        Custom error classes (AppError, NotFoundError, etc.)
    └── jwt.util.js           signToken / verifyToken helpers
models/                       (legacy location — kept for reference only)
```

ASCII architecture:

```
Client
  │
  ▼
Express Router
  │
  ├─► Middleware: validate (Joi strips + validates req.body)
  ├─► Middleware: authenticate (JWT → req.userId, req.userRole)
  │
  ▼
Controller  (reads req → calls service → sends res)
  │
  ▼
Service     (business logic, DB queries via Mongoose)
  │
  ▼
Model       (Mongoose schema)
  │
  ▼
MongoDB

Errors bubble up via next(err) → errorHandler middleware → JSON response
```

---

## API Reference

### Auth

| Method | Endpoint              | Auth | Description                          |
|--------|-----------------------|------|--------------------------------------|
| POST   | `/api/auth/register`  | No   | Create a new user account            |
| POST   | `/api/auth/login`     | No   | Login and receive a JWT token        |
| GET    | `/api/auth/profile`   | Yes  | Get the authenticated user's profile |

### Shipments

| Method | Endpoint                        | Auth | Description                                    |
|--------|---------------------------------|------|------------------------------------------------|
| GET    | `/api/shipments`                | Yes  | List all shipments for the current user        |
| GET    | `/api/shipments/:id`            | Yes  | Get a single shipment (owner or admin only)    |
| POST   | `/api/shipments`                | Yes  | Create a new shipment                          |
| PATCH  | `/api/shipments/:id/status`     | Yes  | Update shipment status (delivered: admin only) |
| DELETE | `/api/shipments/:id`            | Yes  | Delete a shipment (owner or admin only)        |

### Health

| Method | Endpoint     | Auth | Description          |
|--------|--------------|------|----------------------|
| GET    | `/`          | No   | Welcome message      |
| GET    | `/api/ping`  | No   | Liveness check       |

---

## Authentication

Protected routes require a JWT in the `Authorization` header:

```
Authorization: Bearer <token>
```

Tokens are returned by `/api/auth/login` and expire after `JWT_EXPIRES_IN` (default 12h).

---

## Example Requests

**Register**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","password":"securepass123"}'
```

**Login**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@example.com","password":"securepass123"}'
```

**Create Shipment**
```bash
curl -X POST http://localhost:3000/api/shipments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"origin":"Mumbai","destination":"Delhi","weight":12.5,"carrier":"BlueDart"}'
```
