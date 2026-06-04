# LogiTrack API

LogiTrack is a shipment tracking backend for small businesses. It provides user registration, JWT authentication, and CRUD-style shipment management with role-based status updates.

## Tech stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js |
| Framework | Express 4 |
| Database | MongoDB (Mongoose 5) |
| Auth | JSON Web Tokens (`jsonwebtoken`) |
| Validation | Joi |
| Password hashing | bcrypt (12 rounds) |

## Quick start

```bash
git clone https://github.com/kalviumcommunity/dead-code-society-rescue.git
cd dead-code-society-rescue
git checkout -b codebase-rescue
npm install
cp .env.example .env
# Edit .env — set DATABASE_URL and JWT_SECRET
npm run dev
```

Server listens on `http://localhost:3000` by default. Ensure MongoDB is running locally (or use a cloud connection string).

### Smoke test

```bash
# Health
curl http://localhost:3000/api/health

# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","password":"password123"}'

# Login (copy token from response)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@example.com","password":"password123"}'

# Protected profile
curl http://localhost:3000/api/profile \
  -H "Authorization: Bearer YOUR_JWT_HERE"
```

## Environment variables

| Name | Example | Required | Description |
|------|---------|----------|-------------|
| `PORT` | `3000` | No | HTTP port (default `3000`) |
| `DATABASE_URL` | `mongodb://localhost:27017/logitrack` | Yes | MongoDB connection string |
| `JWT_SECRET` | `long-random-string` | Yes | Secret used to sign and verify JWTs |

## API reference

Base path: `/api`. Send JWT as `Authorization: Bearer <token>` (raw token also supported for legacy clients).

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/health` | No | Liveness check |
| GET | `/ping` | No | Simple pong response |
| GET | `/status` | No | Server diagnostics |
| POST | `/auth/register` | No | Create account (bcrypt password) |
| POST | `/auth/login` | No | Login and receive JWT |
| POST | `/register` | No | Legacy alias for register |
| POST | `/login` | No | Legacy alias for login |
| GET | `/profile` | Yes | Current user profile |
| GET | `/shipments` | Yes | List caller's shipments (with owner populated) |
| GET | `/shipments/:id` | Yes | Get one shipment (owner or admin) |
| POST | `/shipments` | Yes | Create shipment |
| PATCH | `/shipments/:id/status` | Yes | Update status (`delivered` requires admin) |
| DELETE | `/shipments/:id` | Yes | Delete shipment (owner or admin) |

## Architecture

```
                    ┌─────────────┐
                    │   Client    │
                    └──────┬──────┘
                           │ HTTP
                    ┌──────▼──────┐
                    │   Routes    │  URL → controller
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
       ┌──────▼─────┐ ┌────▼────┐ ┌─────▼──────┐
       │ Middleware │ │Controller│ │ Validators │
       │ auth/validate│ │ req/res │ │   (Joi)    │
       └──────┬─────┘ └────┬────┘ └────────────┘
              │            │
              │     ┌──────▼──────┐
              │     │  Services   │  business logic
              │     └──────┬──────┘
              │            │
              │     ┌──────▼──────┐
              └────►│   Models    │  Mongoose / MongoDB
                    └─────────────┘
```

### Folder layout

```
src/
├── server.js           # DB connect + listen
├── app.js              # Express app + global middleware
├── routes/             # Route definitions only
├── controllers/        # HTTP layer (req → service → res)
├── services/           # Business logic
├── models/             # Mongoose schemas
├── middlewares/        # auth, validation, errors
├── validators/         # Joi schemas
└── utils/              # hash, JWT, errors, helpers
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with nodemon |
| `npm start` | Production start |

## Further reading

- [AUDIT.md](./AUDIT.md) — pre-refactor issues and severities
- [CHANGELOG.md](./CHANGELOG.md) — what changed and why
