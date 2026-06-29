# LogiTrack API

Logistics and shipment tracking backend. Restructured into a clean MVC setup.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express
- **Database**: MongoDB + Mongoose
- **Auth**: JWT
- **Validation**: Joi
- **Hashing**: bcrypt (12 rounds)

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Setup config
Copy env example:
```bash
cp .env.example .env
```
Fill in database and JWT credentials in `.env`.

### 3. Run server
Development mode:
```bash
npm run dev
```
Production mode:
```bash
npm start
```

## Env Variables

| Variable | Example | Required | Description |
|----------|---------|----------|-------------|
| PORT | 3000 | No | Server port (default 3000) |
| DATABASE_URL | mongodb://localhost:27017/logitrack | Yes | MongoDB connection string |
| JWT_SECRET | secret_key | Yes | Secret key for JWT |
| NODE_ENV | development | No | Environment mode |

## API Routes

All endpoints start with `/api`.

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | No | Create new account |
| POST | `/auth/login` | No | Login and get JWT |
| GET | `/profile` | Yes | Get current user profile |
| GET | `/shipments` | Yes | List shipments |
| GET | `/shipments/:id` | Yes | Get a single shipment details |
| POST | `/shipments` | Yes | Create a shipment |
| PATCH | `/shipments/:id/status` | Yes (Admin only for 'delivered') | Update shipment status |
| DELETE | `/shipments/:id` | Yes | Delete shipment (Owner or Admin only) |
| GET | `/ping` | No | Server ping check |
| GET | `/status` | No | System specs and memory diagnostics |

## Architecture

```text
Request -> Router (JWT & Joi) -> Controller -> Service -> Model -> Database
```
