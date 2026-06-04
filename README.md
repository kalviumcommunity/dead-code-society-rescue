# LogiTrack Backend

REST API for shipment tracking built with Node.js, Express, MongoDB, JWT, bcrypt, and Joi.

## Overview

LogiTrack lets users register, log in, manage shipments, and view their profile through a token-protected API.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js |
| Framework | Express |
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken) |
| Validation | Joi |
| Hashing | bcrypt |

## Quick Start

1. Clone and install.

```bash
git clone https://github.com/kalviumcommunity/dead-code-society-rescue.git
cd dead-code-society-rescue
npm install
```

2. Create your environment file.

```bash
copy .env.example .env
```

3. Fill in the required values in `.env`.

4. Start MongoDB locally and run the API.

```bash
npm run dev
```

## Environment Variables

| Variable | Example | Required | Description |
|----------|---------|----------|-------------|
| PORT | 3000 | No | HTTP port for the API. |
| DATABASE_URL | mongodb://localhost:27017/logitrack | Yes | MongoDB connection string. |
| JWT_SECRET | super_secret_logitrack_2019_dont_share | Yes | Secret used to sign and verify JWTs. |
| JWT_EXPIRES_IN | 12h | No | Optional JWT expiry override. |

## API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/register | No | Register a new user. |
| POST | /api/auth/register | No | Register a new user alias. |
| POST | /api/login | No | Login and receive a JWT. |
| POST | /api/auth/login | No | Login alias. |
| GET | /api/profile | Yes | Get the current user profile. |
| GET | /api/shipments | Yes | List shipments owned by the current user. |
| GET | /api/shipments/:id | Yes | Get one shipment by id. |
| POST | /api/shipments | Yes | Create a shipment. |
| PATCH | /api/shipments/:id/status | Yes | Update a shipment status. |
| DELETE | /api/shipments/:id | Yes | Delete a shipment. |
| GET | /api/status | No | Health/status endpoint. |
| GET | /api/ping | No | Lightweight liveness endpoint. |

## Architecture

```text
Request
	|
	v
Routes
	|
	v
Controllers
	|
	v
Services
	|
	v
Models
	|
	v
MongoDB
```

## Notes

- Send the JWT in the `Authorization` header as either `Bearer <token>` or the raw token string.
- Validation strips unknown fields before data reaches the service layer.
