# LogiTrack API

A backend API for a shipment-tracking platform for small businesses. Users register, log in,
and create/track shipments. Admins can mark shipments as delivered.

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express |
| Database | MongoDB (via Mongoose) |
| Authentication | JWT (jsonwebtoken) |
| Validation | Joi |
| Password hashing | bcrypt |

## Quick Start

```bash
# 1. Clone and enter the project
git clone https://github.com/kalviumcommunity/dead-code-society-rescue.git
cd dead-code-society-rescue

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# then open .env and fill in DATABASE_URL and JWT_SECRET (see table below)

# 4. Run the app
npm run dev      # development, with auto-restart
npm start        # production
```

The server starts on `http://localhost:3000` (or whatever `PORT` is set to). Visit `/` for a
health check, or `/api/status` and `/api/ping` for API-level health checks.

## Environment Variables

| Name | Example | Required | Description |
|---|---|---|---|
| `PORT` | `3000` | No (defaults to 3000) | Port the Express server listens on |
| `DATABASE_URL` | `mongodb://localhost:27017/logitrack` | Yes | MongoDB connection string |
| `JWT_SECRET` | a long random string | Yes | Secret used to sign and verify JWTs — generate your own, never reuse the example value |

## API Reference

All endpoints are mounted under `/api`. Routes marked **Auth** require a valid JWT in the
`Authorization` header (no `Bearer ` prefix — send the raw token).

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| GET | `/api/status` | No | API health check |
| GET | `/api/ping` | No | Lightweight liveness check |
| POST | `/api/auth/register` | No | Create a new account (`name`, `email`, `password`) |
| POST | `/api/auth/login` | No | Log in and receive a JWT (`email`, `password`) |
| GET | `/api/users/profile` | Yes | Get the authenticated user's profile |
| GET | `/api/shipments` | Yes | List all shipments owned by the authenticated user |
| GET | `/api/shipments/:id` | Yes (owner or admin) | Get a single shipment by id |
| POST | `/api/shipments` | Yes | Create a shipment (`origin`, `destination`, `weight`, `carrier`) |
| PATCH | `/api/shipments/:id/status` | Yes (admin for `status: "delivered"`) | Update a shipment's status (`pending`, `in_transit`, `delivered`) |
| DELETE | `/api/shipments/:id` | Yes (owner or admin) | Delete a shipment |

## Architecture

```
Request
   │
   ▼
┌─────────────┐     URL + method only, no logic
│   routes/   │ ──▶ maps to a controller function
└─────────────┘
   │
   ▼
┌─────────────┐     reads req, calls a service, sends res
│ controllers/│ ──▶ no direct database access
└─────────────┘
   │
   ▼
┌─────────────┐     all business logic lives here
│  services/  │ ──▶ calls models, other services, utils
└─────────────┘
   │
   ▼
┌─────────────┐     Mongoose schemas only
│   models/   │
└─────────────┘

┌──────────────┐    cross-cutting concerns, run before
│ middlewares/ │ ── controllers: auth, validation, error
└──────────────┘    handling

┌─────────────┐     shared helpers: hashing, JWT signing,
│   utils/    │ ── custom error classes
└─────────────┘

┌──────────────┐    Joi schemas, one per route group,
│ validators/  │ ── wired through validation middleware
└──────────────┘
```

Errors thrown anywhere in a service or controller are passed to `next(err)`, caught by the
centralized error middleware in `src/middlewares/error.middleware.js` (mounted last in
`src/app.js`), and turned into a consistent JSON response with the correct HTTP status code.

## Project History

This codebase was rescued from an unstructured, insecure single-file Express app. See
[`AUDIT.md`](./AUDIT.md) for the full list of issues found in the original code, and
[`CHANGELOG.md`](./CHANGELOG.md) for every change made and the reasoning behind it.
