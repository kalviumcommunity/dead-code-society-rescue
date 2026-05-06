# LogiTrack API

REST API for shipment tracking built with Node.js, Express, MongoDB, bcrypt, JWT, and Joi.

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express 4 |
| Database | MongoDB + Mongoose |
| Auth | JWT |
| Validation | Joi |
| Password Hashing | bcrypt |

## Quick Start

1. Clone and install dependencies.

```bash
npm install
```

2. Copy the example environment file and configure values.

```bash
copy .env.example .env
```

3. Start MongoDB locally and run the server.

```bash
npm run dev
```

## Environment Variables

| Name | Example | Required | Description |
|---|---|---|---|
| PORT | 3000 | No | HTTP port for the API server |
| DATABASE_URL | mongodb://localhost:27017/logitrack | Yes | MongoDB connection string |
| JWT_SECRET | replace-with-a-long-random-secret | Yes | Secret used to sign JWTs |
| BCRYPT_ROUNDS | 12 | No | bcrypt cost factor for password hashing |

## API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | / | No | Health message |
| GET | /api/status | No | API status endpoint |
| POST | /api/auth/register | No | Create a new user |
| POST | /api/auth/login | No | Sign in and receive a JWT |
| GET | /api/auth/profile | Yes | Get the current user profile |
| GET | /api/shipments | Yes | List shipments for the signed-in user |
| GET | /api/shipments/:id | Yes | Get a shipment by id |
| POST | /api/shipments | Yes | Create a shipment |
| PATCH | /api/shipments/:id/status | Yes | Update shipment status |
| DELETE | /api/shipments/:id | Yes | Delete a shipment |

## Architecture

Request
  -> Route
    -> Controller
      -> Service
        -> Model
          -> MongoDB

## Notes

- Send protected requests with `Authorization: Bearer <token>`.
- Validation errors return HTTP 422 with a readable message.
- Passwords are hashed with bcrypt before storage.
