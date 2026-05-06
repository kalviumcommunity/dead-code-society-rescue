# LogiTrack Backend

REST API for shipment tracking built with Node.js, Express, MongoDB, bcrypt, JWT, and Joi.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js |
| Framework | Express |
| Database | MongoDB + Mongoose |
| Auth | JSON Web Tokens |
| Password Hashing | bcrypt |
| Validation | Joi |

## Quick Start

1. Install dependencies.

```bash
npm install
```

2. Copy the example environment file.

```bash
copy .env.example .env
```

3. Update `.env` with your values.

4. Start MongoDB locally.

5. Run the app.

```bash
npm run dev
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| PORT | No | Port for the HTTP server |
| DATABASE_URL | Yes | MongoDB connection string |
| JWT_SECRET | Yes | Secret used to sign tokens |
| NODE_ENV | No | Use `production` in deployed environments |

## API Endpoints

All endpoints are mounted under `/api`.

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | No | Create a new user |
| POST | `/auth/login` | No | Login and receive a JWT |
| GET | `/users/profile` | Yes | Fetch the current user profile |
| GET | `/shipments` | Yes | List shipments for the current user |
| POST | `/shipments` | Yes | Create a shipment |
| GET | `/shipments/:id` | Yes | Fetch one shipment |
| PATCH | `/shipments/:id/status` | Yes | Update shipment status |
| DELETE | `/shipments/:id` | Yes | Delete a shipment |
| GET | `/status` | No | Health check |
| GET | `/ping` | No | Lightweight liveness check |

## Architecture

Request -> Route -> Controller -> Service -> Model -> MongoDB

```
Request
	|
	v
Router
	|
	v
Controller
	|
	v
Service
	|
	v
Model
	|
	v
MongoDB
```

## Validation Rules

- Email must be valid.
- Password must be at least 8 characters and include an uppercase letter and a number.
- Unknown fields are stripped before data reaches the service layer.
- Shipment status is restricted to `pending`, `in-progress`, `delivered`, or `cancelled`.

## Security Notes

- Passwords are hashed with bcrypt using 12 salt rounds.
- `.env` is ignored by git.
- JWT verification is centralized in middleware.
- Shipment listing uses `populate` instead of an N+1 loop.

## Scripts

```bash
npm run dev
npm start
npm test
```
