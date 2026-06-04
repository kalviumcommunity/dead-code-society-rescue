# 🚚 LogiTrack API — Shipment Tracking Platform

Welcome to the **LogiTrack** backend! This is the core API for our internal shipment tracking system, refactored from a legacy flat structure into a clean, modern, and secure MVC architecture.

---

## 🚀 Getting Started (Under 5 Minutes)

We've designed the development environment to boot up instantly with **zero external dependencies**. If you don't have MongoDB installed locally, the application automatically provisions and runs an in-memory MongoDB instance (`mongodb-memory-server`).

### 1. Installation
Clone the repository and install the dependencies:
```bash
npm install
```

### 2. Configure Environment Variables
Copy the example environment file:
```bash
cp .env.example .env
```
*(The default values in `.env` are pre-configured to work immediately out of the box).*

### 3. Run the Server
Start the development server with automatic code reloading:
```bash
npm run dev
```
You will see output indicating that the database connected successfully:
```text
Server is alive on port 3000
Local MongoDB not running. Starting MongoMemoryServer...
--- DATABASE CONNECTED (MongoMemoryServer) --- mongodb://127.0.0.1:xxxxx/
```

---

## ⚙️ Environment Variables

The project uses a `.env` file for configuration. The following variables are supported:

| Variable Name | Description | Default Value | Required |
|---|---|---|---|
| `PORT` | The port the Express server will listen on. | `3000` | No |
| `DATABASE_URL` | MongoDB connection URI. | `mongodb://localhost:27017/logitrack` | No (falls back to memory DB) |
| `JWT_SECRET` | Secret key used to sign and verify JSON Web Tokens. | `secret123` | Yes |

---

## 📂 Project Architecture (MVC)

The codebase has been refactored into a modular Model-View-Controller (MVC) structure to separate concerns, ensure maintainability, and allow parallel development:

```text
src/
├── controllers/      # Route controllers: handle HTTP request parsing & format responses
│   ├── auth.controller.js
│   └── shipment.controller.js
├── middlewares/      # Express middlewares (authentication, request validation, error handler)
│   ├── auth.middleware.js
│   ├── error.middleware.js
│   └── validate.middleware.js
├── models/           # Mongoose schemas & indexes defining database entities
│   ├── Shipment.js
│   └── User.js
├── routes/           # Routing layers matching API endpoints to controllers
│   └── index.js
├── services/         # Business logic and database interactions
│   ├── auth.service.js
│   └── shipment.service.js
├── utils/            # Utilities (cryptographic hashing, JWT helper, custom errors)
│   ├── errors.util.js
│   ├── hashing.util.js
│   └── jwt.util.js
└── app.js            # Express application bootstrapper & DB connection manager
```

---

## 🛡️ Security & Performance Features

- **Password Hashing**: Upgraded from vulnerable MD5 hashes to strong `bcrypt` hashing utilizing 12 salt rounds.
- **Input Validation**: All incoming requests that accept request bodies are checked against strict `Joi` validation schemas, preventing injection attacks and bad data. Unwanted properties are automatically stripped (`stripUnknown: true`).
- **N+1 Query Fix**: Fixed legacydb loops. Query fetching user details for shipments is optimized via Mongoose `.populate('userId')` to reduce query overhead from $O(N)$ down to a single batch join.
- **Centralized Error Middleware**: All controllers forward caught exceptions directly to `next(err)`, allowing a dedicated middleware to return consistent semantic responses and HTTP status codes (e.g. 401 Unauthorized, 404 Not Found, 422 Unprocessable Entity, 409 Conflict, 403 Forbidden).

---

## 📝 API Endpoints Specification

All routes are prefixed with `/api`.

### Authentication Routes
| Method | Endpoint | Auth | Request Body | Success Response | Description |
|---|---|---|---|---|---|
| **POST** | `/register` | None | `{ name, email, password, role }` | `201 Created` | Registers a new account. |
| **POST** | **`/login`** | None | `{ email, password }` | `200 OK` (returns JWT) | Authenticates user & returns token. |
| **GET** | **`/profile`** | JWT | None | `200 OK` | Retrieves current user profile details. |

### Shipment Routes
| Method | Endpoint | Auth | Role | Request Body | Success Response | Description |
|---|---|---|---|---|---|---|
| **GET** | `/shipments` | JWT | User/Admin | None | `200 OK` | Retrieves all shipments for the logged-in user. |
| **GET** | `/shipments/:id` | JWT | User/Admin | None | `200 OK` | Retrieves details of a specific shipment by ID. |
| **POST** | `/shipments` | JWT | User/Admin | `{ origin, destination, weight, carrier }` | `201 Created` | Creates a new shipment. |
| **PATCH** | `/shipments/:id/status` | JWT | Admin-only* | `{ status }` | `200 OK` | Updates status of a shipment. *User can only update status if not setting to "delivered". |
| **DELETE** | `/shipments/:id` | JWT | Owner/Admin | None | `200 OK` | Permanently deletes a shipment. |

### System Utility Routes
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| **GET** | `/ping` | None | Health check endpoint returning `{ "pong": "active" }`. |
| **GET** | `/status` | None | Returns system hardware, release version, uptime, and memory usage metrics. |
