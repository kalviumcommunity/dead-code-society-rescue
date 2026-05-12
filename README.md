# LogiTrack Backend

LogiTrack is a small Express + MongoDB shipment tracking backend for small businesses. It handles account creation, login, profile access, and shipment lifecycle operations with JWT auth, Joi validation, and bcrypt password hashing.

## Tech Stack

| Layer | Choice |
|---|---|
| Runtime | Node.js |
| Framework | Express |
| Database | MongoDB + Mongoose |
| Authentication | JWT |
| Validation | Joi |
| Password Hashing | bcrypt (12 rounds) |

## Quick Start

1. Clone the repository.
2. Install dependencies with `npm install`.
3. Copy `.env.example` to `.env` and confirm `DATABASE_URL` and `JWT_SECRET` are set.
4. Start MongoDB locally.
5. Run `npm run dev`.
6. Hit `http://localhost:3000/api/health` to confirm the API is live.

## Environment Variables

| Name | Example | Required | Description |
|---|---|---|---|
| `PORT` | `3000` | No | Port used by the HTTP server. |
| `DATABASE_URL` | `mongodb://localhost:27017/logitrack` | Yes | MongoDB connection string for Mongoose. |
| `JWT_SECRET` | `super_secret_logitrack_2019_dont_share` | Yes | Secret used to sign and verify JWTs. |

## API Reference

All protected routes require `Authorization: Bearer <token>`.

| Method | Endpoint | Auth | Description |
|---|---|---:|---|
| GET | `/` | No | Root status message. |
| GET | `/api/health` | No | Lightweight health check. |
| GET | `/api/status` | No | Runtime metadata such as uptime and host info. |
| GET | `/api/ping` | No | Simple smoke-test endpoint. |
| POST | `/api/register` | No | Create a new user account and return a JWT. |
| POST | `/api/login` | No | Authenticate a user and return a JWT. |
| GET | `/api/profile` | Yes | Return the current authenticated user's profile. |
| GET | `/api/shipments` | Yes | List shipments visible to the current user. |
| GET | `/api/shipments/:id` | Yes | Fetch one shipment by id with access control. |
| POST | `/api/shipments` | Yes | Create a shipment for the authenticated user. |
| PATCH | `/api/shipments/:id/status` | Yes | Update a shipment status. |
| DELETE | `/api/shipments/:id` | Yes | Delete a shipment the user can access. |

## Architecture

```text
Client
  |
  v
Routes -> Validation/Auth Middleware -> Controllers -> Services -> Models -> MongoDB
                 |                          |
                 |                          +--> Utils (hashing, JWT, errors, helpers)
                 |
                 +--> Centralized error handler
```

## Notes

- Passwords are hashed with bcrypt using 12 rounds.
- Validation strips unknown fields before they reach services.
- Shipment listing uses `populate()` instead of the old N+1 loop.
- Controllers stay thin; services hold the business rules.# 🚚 LogiTrack API v1.0.0-beta-final

Welcome to the **LogiTrack** backend! This is the core API for our internal shipment tracking system. Built with Node.js and MongoDB to be fast and lightweight. 🚀

## 📦 What is LogiTrack?
LogiTrack helps our logistics team manage shipments across the globe. It handles everything from user registration to real-time status updates and shipment management.

## 🛠 Features
- 🔐 **Secure Auth**: Token-based authentication for all users.
- 👤 **User Profiles**: Manage your account and roles.
- 📦 **Shipment Tracking**: Create and track shipments with ease.
- 🚫 **Role Management**: Admin-only routes for status changes.

## 🚀 Getting Started
Setting up the project is a breeze:

### 1. Installation
Clone the repo and install the dependencies:
```bash
npm install
```

### 2. Start the Engine
Run the development server:
```bash
npm run dev
```
Or start in production:
```bash
npm start
```

## 📝 API Endpoints
The following routes are available (all under `/api`):

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Create a new account |
| POST | `/login` | Get your token |
| GET | `/shipments` | View your shipments |
| POST | `/shipments` | Create new shipment |
| PATCH | `/shipments/:id/status` | Update status (Admin) |

## 🚧 TODO List
We have some big plans for future updates:
- ✅ Improve database performance
- 📧 Add automated email alerts
- 🧪 Add unit tests for all routes
- 🛡️ Add more robust validation
- 📊 Dashboard frontend integration

---
### 🛠 Author
*Created with ❤️ by Senior Junior Developer*

##### 
**Note**: Please check with the lead developer if you have issues with the database connection.
