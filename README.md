# LogiTrack Backend

LogiTrack is a Node.js API for managing users and shipments in a logistics workflow. It provides authentication, profile lookup, shipment creation, shipment status updates, and shipment deletion with role-aware access control.

## Overview

The backend is organized as a layered Express application:

- Routes map HTTP methods and URLs to controller functions.
- Controllers receive `req`, call services, and send responses.
- Services own business logic and database access.
- Middleware handles authentication, validation, and centralized error handling.
- Utils provide shared helpers for hashing, tokens, response formatting, and error types.

## Tech Stack

| Layer | Technology | Purpose |
|------|------------|---------|
| Runtime | Node.js | JavaScript server runtime |
| Framework | Express | HTTP routing and middleware |
| Database | MongoDB with Mongoose | Document storage and data modeling |
| Auth | JWT | Stateless token-based authentication |
| Validation | Joi | Request body validation and sanitizing |
| Hashing | bcrypt | Secure password hashing |

## Quick Start

1. Clone the repository.
2. Install dependencies.

```bash
npm install
```

3. Create your environment file from the example and set the values.
4. Run the app.

```bash
npm start
```

For development:

```bash
npm run dev
```

## Environment Variables

| Name | Example | Required | Description |
|------|---------|----------|-------------|
| `PORT` | `3000` | No | Port the server listens on. Defaults to `3000`. |
| `DATABASE_URL` | `mongodb://localhost:27017/logitrack` | Yes | MongoDB connection string. |
| `JWT_SECRET` | `super_secret_logitrack_2019_dont_share` | Yes | Secret used to sign and verify JWTs. |

## API Reference

All routes are served under `/api` except the root health route.

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/` | No | Basic app home response. |
| GET | `/api/status` | No | Returns runtime status information. |
| GET | `/api/ping` | No | Lightweight liveness check. |
| POST | `/api/register` | No | Creates a new user account. |
| POST | `/api/login` | No | Authenticates a user and returns a JWT. |
| GET | `/api/profile` | Yes | Returns the authenticated user profile. |
| GET | `/api/shipments` | Yes | Lists shipments that belong to the authenticated user. |
| GET | `/api/shipments/:id` | Yes | Returns one shipment if the caller is authorized. |
| POST | `/api/shipments` | Yes | Creates a shipment for the authenticated user. |
| PATCH | `/api/shipments/:id/status` | Yes | Updates shipment status with role checks. |
| DELETE | `/api/shipments/:id` | Yes | Deletes a shipment if the caller is authorized. |

## Architecture

```text
				+----------------------+
				|      HTTP Client      |
				+----------+-----------+
						   |
						   v
				+----------------------+
				|       routes/        |
				|  URL -> controller   |
				+----------+-----------+
						   |
						   v
				+----------------------+
				|    controllers/      |
				| req -> service -> res|
				+----------+-----------+
						   |
						   v
				+----------------------+
				|      services/       |
				| business logic + DB  |
				+----------+-----------+
						   |
						   v
				+----------------------+
				|       models/        |
				|    Mongoose schemas  |
				+----------------------+

	middlewares/ -> auth, validation, error handling
	utils/       -> bcrypt, JWT, errors, response helpers
```

## Notes

- Passwords are hashed with bcrypt.
- JWT verification is handled by middleware before protected routes run.
- Validation uses Joi and strips unknown request body fields.
- Errors are normalized by a centralized error handler.
