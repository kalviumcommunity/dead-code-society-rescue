# ShipAPI - Shipment Tracking Backend

REST API for shipment tracking built with Node.js, Express, and MongoDB.

## Tech Stack

| Layer | Technology |
|------|------------|
| Runtime | Node.js |
| Framework | Express |
| Database | MongoDB + Mongoose |
| Auth | JWT (`jsonwebtoken`) |
| Validation | Joi |
| Hashing | bcrypt |

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env

# 3. Fill values in .env
# DATABASE_URL=mongodb://localhost:27017/logitrack
# JWT_SECRET=your-very-long-secret

# 4. Run development server
npm run dev
```

## Environment Variables

| Variable | Example | Required | Description |
|----------|---------|----------|-------------|
| `PORT` | `3000` | Yes | HTTP server port |
| `DATABASE_URL` | `mongodb://localhost:27017/logitrack` | Yes | MongoDB connection string |
| `JWT_SECRET` | `a-very-long-random-secret` | Yes | JWT signing secret (minimum 32 chars recommended) |
| `NODE_ENV` | `development` | Yes | Runtime mode (`development` or `production`) |

## API Reference

All endpoints are under `/api`.

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/status` | No | Service status and uptime |
| GET | `/ping` | No | Simple health ping |
| POST | `/auth/register` | No | Register new user |
| POST | `/auth/login` | No | Login and receive JWT |
| GET | `/profile` | Yes | Get authenticated user profile |
| GET | `/shipments` | Yes | List shipments for authenticated user |
| GET | `/shipments/:id` | Yes | Get shipment by id (owner or admin) |
| POST | `/shipments` | Yes | Create shipment |
| PATCH | `/shipments/:id/status` | Yes | Update shipment status |
| DELETE | `/shipments/:id` | Yes | Delete shipment |

## Sample Auth Header

```http
Authorization: Bearer <your-jwt-token>
```

## Architecture

```text
Request
	-> Router (src/routes)
			-> Controller (src/controllers)
					-> Service (src/services)
							-> Model (src/models)
									-> MongoDB
```

## Project Structure

```text
src/
	app.js
	server.js
	controllers/
	middlewares/
	models/
	routes/
	services/
	utils/
	validators/
```

## Notes

- Passwords are hashed with bcrypt (12 salt rounds).
- All POST/PATCH request bodies are validated with Joi.
- Errors are handled by centralized middleware.
