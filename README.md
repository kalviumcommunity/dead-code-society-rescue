<!-- ADDED: Updated README documentation for setup, tech stack, and API reference. -->
# LogiTrack — Shipment Tracking Backend

> REST API for tracking shipments built with Node.js, Express, and MongoDB.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 18+ / 20 |
| Framework | Express 4 |
| Database | MongoDB + Mongoose 5 |
| Auth | JWT (jsonwebtoken) |
| Validation | Joi |
| Hashing | bcrypt |

## Quick Start

### 1. Clone and install
```bash
git clone https://github.com/ruchithata/dead-code-society-rescue.git
cd dead-code-society-rescue
npm install
```

### 2. Set up environment
```bash
cp .env.example .env
```
Ensure you update the `.env` file with your local MongoDB connection string and a secret key.

### 3. Start MongoDB locally
```bash
mongod --dbpath ./data
```

### 4. Start the dev server
```bash
npm run dev
```

## Environment Variables

| Variable | Example | Required | Description |
|----------|---------|----------|-------------|
| PORT | 3000 | Yes | Server port |
| DATABASE_URL | mongodb://localhost:27017/logitrack | Yes | MongoDB connection string |
| JWT_SECRET | super_secret_logitrack_2019_dont_share | Yes | Must be min 32 chars |

## API Reference

All endpoints are prefix-mounted on both legacy `/api` and nested `/api/auth` / `/api/users` for full compatibility.

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` (or `/api/register`) | No | Register new user |
| POST | `/api/auth/login` (or `/api/login`) | No | Login, receive JWT |
| GET | `/api/users/profile` (or `/api/profile`) | Yes | Get currently logged-in user profile |
| GET | `/api/shipments` | Yes | List shipments owned by user |
| GET | `/api/shipments/:id` | Yes | Get a single shipment (owner or admin only) |
| POST | `/api/shipments` | Yes | Create shipment |
| PATCH | `/api/shipments/:id/status` | Yes | Update status (delivered: Admin only, others: Owner/Admin) |
| DELETE | `/api/shipments/:id` | Yes | Delete shipment (owner or admin only) |
| GET | `/api/status` | No | Get OS system health status |
| GET | `/api/ping` | No | Simple server availability ping |

## Architecture

```text
Request
  └─► Router (src/routes/)
        └─► Controller (src/controllers/)
              └─► Service (src/services/)
                    └─► Model (src/models/)
                          └─► MongoDB
```
