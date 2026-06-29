# 🚚 LogiTrack API

LogiTrack is a Node.js and Express backend for shipment tracking and user management. The project now follows a cleaner MVC-inspired structure and includes validation, secure authentication, centralized error handling, and performance-oriented database access.

## 🧱 Stack

| Layer | Technology | Purpose |
| --- | --- | --- |
| Runtime | Node.js | Server runtime |
| Framework | Express | Routing and middleware |
| Database | MongoDB + Mongoose | Data persistence and schemas |
| Auth | JWT + bcryptjs | Token-based auth and password hashing |
| Validation | Joi | Request validation |
| Dev tooling | Nodemon | Local development server |

## 🏗 Architecture

The app is organized into the following layers under the src directory:

- src/routes: route definitions
- src/controllers: request handlers
- src/services: business logic
- src/models: Mongoose schemas
- src/middlewares: auth and error middleware
- src/utils: helpers and validation utilities

## 📝 API Endpoints

All endpoints are mounted under /api.

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | /register | Create a new account |
| POST | /login | Sign in and receive a JWT |
| GET | /profile | Return the authenticated user profile |
| GET | /shipments | List shipments for the current user |
| GET | /shipments/:id | Fetch one shipment |
| POST | /shipments | Create a new shipment |
| PATCH | /shipments/:id/status | Update shipment status (admin only) |
| DELETE | /shipments/:id | Remove a shipment |

## ✅ Fixes Completed

| Area | Change |
| --- | --- |
| Audit | Added a documented smell audit in AUDIT.md |
| Structure | Refactored the flat route file into MVC-style modules |
| Validation | Added Joi validation for auth and shipment routes |
| Security | Replaced MD5 with bcrypt and extracted reusable auth middleware |
| Reliability | Added centralized error handling and removed duplicated route-level try/catch logic |
| Performance | Replaced N+1 shipment lookups with populate-based queries |
| Documentation | Added JSDoc comments to exported functions |

## 🚀 Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a local environment file:
   ```bash
   cp .env.example .env
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 📜 Changelog

See CHANGELOG.md for the release history.
