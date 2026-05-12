# LogiTrack API

LogiTrack is a backend API for logistics and shipment tracking. It handles user registration, login, profile access, shipment creation, shipment lookup, shipment updates, and shipment deletion behind JWT-based authentication.

## Tech Stack

| Area | Technology |
|------|------------|
| Runtime | Node.js |
| Framework | Express |
| Database | MongoDB with Mongoose |
| Auth | JSON Web Tokens |
| Validation | Joi |
| Password Hashing | bcrypt |

## Quick Start

1. Clone the repository.
2. Install dependencies with `npm install`.
3. Copy `.env.example` to `.env` and set `DATABASE_URL` and `JWT_SECRET`.
4. Start the API with `npm run dev`.

If MongoDB is unavailable locally, the public health routes will still respond, but registration, login, and shipment APIs require a database connection.

## Environment Variables

| Name | Example | Required | Description |
|------|---------|----------|-------------|
| `PORT` | `3000` | No | Port the HTTP server listens on. |
| `DATABASE_URL` | `mongodb://localhost:27017/logitrack` | Yes | MongoDB connection string. |
| `JWT_SECRET` | `super_secret_logitrack_2019_dont_share` | Yes | Secret used to sign and verify JWTs. |

## API Reference

All API routes are mounted under `/api`.

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/` | No | Root health message from the app entrypoint. |
| GET | `/api/status` | No | Returns runtime status and process information. |
| GET | `/api/ping` | No | Lightweight ping endpoint. |
| POST | `/api/register` | No | Creates a new user with Joi validation and bcrypt hashing. |
| POST | `/api/login` | No | Authenticates a user and returns a JWT. |
| GET | `/api/profile` | Yes | Returns the authenticated user's profile. |
| GET | `/api/shipments` | Yes | Lists shipments visible to the current user. |
| GET | `/api/shipments/:id` | Yes | Returns a single shipment when the user has access. |
| POST | `/api/shipments` | Yes | Creates a shipment for the authenticated user. |
| PATCH | `/api/shipments/:id/status` | Yes | Updates shipment status after authorization checks. |
| DELETE | `/api/shipments/:id` | Yes | Deletes a shipment after authorization checks. |

## Architecture

```text
HTTP Request
	|
	v
src/routes/index.js
	|
	+--> controllers/
	|       |
	|       +--> services/
	|               |
	|               +--> models/
	|               +--> utils/
	|
	+--> middlewares/
			|
			+--> validators/
			+--> utils/errors.util.js
```

Controllers read the request and send the response. Services hold business logic. Models define MongoDB schemas. Middlewares handle auth, validation, and errors. Utilities provide reusable helpers such as hashing, JWT signing, and response serialization.
