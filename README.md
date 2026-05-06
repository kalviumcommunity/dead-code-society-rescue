# LogiTrack API

> REST API for shipment tracking built with Node.js, Express, and MongoDB.

## Tech Stack

| Layer      | Technology              |
|------------|-------------------------|
| Runtime    | Node.js 18+             |
| Framework  | Express 4               |
| Database   | MongoDB + Mongoose 5    |
| Auth       | JWT (jsonwebtoken)      |
| Validation | Joi 17                  |
| Hashing    | bcrypt (12 rounds)      |

---

## Quick Start

```bash
# 1. Clone and install
git clone https://github.com/sowreddy14/dead-code-society-rescue.git
cd dead-code-society-rescue
npm install

# 2. Set up environment variables
cp .env.example .env
# Open .env and fill in DATABASE_URL and JWT_SECRET

# 3. Start MongoDB locally (if not using Atlas)
mongod --dbpath ./data

# 4. Start the dev server
npm run dev
```

The API will be available at `http://localhost:3000`.

---

## Environment Variables

| Variable       | Example                                    | Required | Description                              |
|----------------|--------------------------------------------|----------|------------------------------------------|
| `PORT`         | `3000`                                     | No       | Server port (defaults to 3000)           |
| `DATABASE_URL` | `mongodb://localhost:27017/logitrack`      | Yes      | MongoDB connection string                |
| `JWT_SECRET`   | `a-long-random-string-min-32-chars`        | Yes      | Secret used to sign JWTs (min 32 chars)  |
| `NODE_ENV`     | `development`                              | No       | `development` or `production`            |

> ⚠️ Never commit `.env` to version control. It is listed in `.gitignore`.

---

## API Reference

### Auth

| Method | Endpoint              | Auth | Description                        |
|--------|-----------------------|------|------------------------------------|
| POST   | `/api/auth/register`  | No   | Register a new user account        |
| POST   | `/api/auth/login`     | No   | Login and receive a JWT            |

### Users

| Method | Endpoint              | Auth | Description                        |
|--------|-----------------------|------|------------------------------------|
| GET    | `/api/users/profile`  | Yes  | Get the authenticated user profile |

### Shipments

| Method | Endpoint                        | Auth  | Description                              |
|--------|---------------------------------|-------|------------------------------------------|
| GET    | `/api/shipments`                | Yes   | List all shipments for the current user  |
| POST   | `/api/shipments`                | Yes   | Create a new shipment                    |
| GET    | `/api/shipments/:id`            | Yes   | Get a single shipment by ID              |
| PATCH  | `/api/shipments/:id/status`     | Yes   | Update shipment status                   |
| DELETE | `/api/shipments/:id`            | Yes   | Delete a shipment                        |

**Authentication:** Pass the JWT in the `Authorization` header:
```
Authorization: <your-jwt-token>
```

### Request / Response Examples

**Register**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","password":"Secret123"}'
```

**Login**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"Secret123"}'
# Response: { "token": "eyJhbGci...", "user": { ... } }
```

**Create Shipment**
```bash
curl -X POST http://localhost:3000/api/shipments \
  -H "Authorization: <token>" \
  -H "Content-Type: application/json" \
  -d '{"origin":"New York","destination":"Los Angeles","weight":2.5,"carrier":"FedEx"}'
```

---

## Architecture

```
Request
  └─► Router (src/routes/)
        └─► Middleware (auth, validate)
              └─► Controller (src/controllers/)
                    └─► Service (src/services/)
                          └─► Model (src/models/)
                                └─► MongoDB
```

### Folder Structure

```
src/
├── routes/
│   ├── auth.routes.js
│   ├── shipment.routes.js
│   └── user.routes.js
├── controllers/
│   ├── auth.controller.js
│   ├── shipment.controller.js
│   └── user.controller.js
├── services/
│   ├── auth.service.js
│   ├── shipment.service.js
│   └── user.service.js
├── models/
│   ├── User.model.js
│   └── Shipment.model.js
├── middlewares/
│   ├── auth.middleware.js
│   ├── validate.middleware.js
│   └── error.middleware.js
├── validators/
│   ├── auth.validator.js
│   └── shipment.validator.js
└── utils/
    ├── errors.util.js
    ├── hash.util.js
    └── jwt.util.js
```

**Layer responsibilities:**
- **routes/** — URL + HTTP method → controller. No logic.
- **controllers/** — Read `req`, call a service, send `res`. No DB calls.
- **services/** — All business logic. Calls models, throws typed errors.
- **models/** — Mongoose schemas only.
- **middlewares/** — Auth verification, input validation, central error handling.
- **utils/** — Shared helpers: bcrypt hashing, JWT signing/verifying, error classes.

---

## Supported Carriers

`FedEx` | `UPS` | `DHL` | `USPS`

## Shipment Statuses

`pending` → `in-progress` → `delivered` | `cancelled`

> Only admin-role users can set status to `delivered`.
