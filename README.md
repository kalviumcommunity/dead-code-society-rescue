# ShipAPI — Shipment Tracking Backend

> REST API for tracking shipments built with Node.js, Express, and MongoDB.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 20 |
| Framework | Express 4 |
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken) |
| Validation | Joi |
| Hashing | bcrypt |

## Quick Start

# 1. Clone and install
git clone https://github.com/TChrisVivek/dead-code-society-rescue.git
cd dead-code-society-rescue
npm install

# 2. Set up environment
cp .env.example .env

# 3. Start MongoDB locally
mongod --dbpath ./data

# 4. Start the dev server
npm run dev

## Environment Variables

| Variable | Example | Required | Description |
|----------|---------|----------|-------------|
| PORT | 3000 | Yes | Server port |
| DATABASE_URL | mongodb://localhost:27017/logitrack | Yes | MongoDB connection string |
| JWT_SECRET | some-long-random-string | Yes | Must be min 32 chars |
| NODE_ENV | development | Yes | development or production |

## API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | No | Register new user |
| POST | /api/auth/login | No | Login, receive JWT |
| GET | /api/shipments | Yes | List my shipments |
| POST | /api/shipments | Yes | Create shipment |
| GET | /api/shipments/:id | Yes | Get single shipment |
| PATCH | /api/shipments/:id/status | Admin | Update status |

## Architecture

Request
  └─► Router (routes/)
        └─► Controller (controllers/)
              └─► Service (services/)
                    └─► Model (models/)
                          └─► MongoDB
