# 🚚 LogiTrack API v1.1.0-stable

Welcome to **LogiTrack**! This is the restructured, hardened, and optimized backend service for our shipment tracking and logistics management system. Built with Node.js, Express, and MongoDB.

---

## 📦 Tech Stack

| Layer / Component | Technology | Detail |
|---|---|---|
| **Runtime Environment** | Node.js | v18+ recommended |
| **Web Framework** | Express | Modular Router, Controllers, Custom Middlewares |
| **Database (ODM)** | MongoDB / Mongoose | Schema definitions, validation, populated relations |
| **In-Memory Database** | MongoDB Memory Server | Auto-fallback dev database for seamless cold setup |
| **Authentication** | JWT (jsonwebtoken) | Stateless token authorization |
| **Hashing & Hashing Salt** | bcrypt | High-entropy password hashing (12 rounds) |
| **Validation** | Joi | Strict request body schema validation |

---

## 🚀 Quick Start (Cold Setup)

Get up and running in less than a minute:

### 1. Clone the repository and install dependencies
```bash
git clone https://github.com/kalviumcommunity/dead-code-society-rescue.git
cd dead-code-society-rescue
git checkout -b codebase-rescue
npm install
```

### 2. Configure environment variables
Copy the sample environment file to create your own configuration:
```bash
cp .env.example .env
```
*(Optionally, fill in your own `DATABASE_URL` and `JWT_SECRET` in `.env`. If `DATABASE_URL` is left empty or is unreachable, the application will automatically spin up an in-memory MongoDB database.)*

### 3. Run the development server
```bash
npm run dev
```

### 4. Run in production mode
```bash
npm start
```

---

## 🔑 Environment Variables

| Name | Example | Required | Description |
|---|---|---|---|
| `PORT` | `3000` | No | Port on which the API server listens (default: `3000`). |
| `DATABASE_URL` | `mongodb://localhost:27017/logitrack` | No | Connection string for MongoDB database. Fallback to `mongodb-memory-server` occurs automatically if connection fails or is undefined. |
| `JWT_SECRET` | `super_secret_logitrack_2019_dont_share` | Yes | Private secret key used to sign and verify JWT tokens. |

---

## 📝 API Endpoints Reference

All routes are mounted under the `/api` prefix.

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| **POST** | `/api/register` | No | Registers a new user. Performs Joi validation. Hashes password with bcrypt. Returns HTTP `201`. |
| **POST** | `/api/login` | No | Authenticates user credentials. Returns user details and signed JWT. |
| **GET** | `/api/profile` | Yes | Retrieves profile of the logged-in user. |
| **GET** | `/api/shipments` | Yes | Lists shipments belonging to the logged-in user. Fetches user details in a single query (fixes N+1). |
| **GET** | `/api/shipments/:id` | Yes | Retrieves a specific shipment. Enforces owner/admin role. |
| **POST** | `/api/shipments` | Yes | Creates a new shipment. Auto-generates a tracking ID. Returns HTTP `201`. |
| **PATCH** | `/api/shipments/:id/status` | Yes | Updates shipment status. Enforces owner/admin role. Only admin can set status to `delivered`. |
| **DELETE** | `/api/shipments/:id` | Yes | Deletes a shipment. Enforces owner/admin authorization check. |
| **GET** | `/api/status` | No | Returns basic OS and runtime health status. |
| **GET** | `/api/ping` | No | Standard ping route to check API server status. |

---

## 📐 Architecture Diagram

```
                      +-------------------+
                      |    HTTP Client    |
                      +---------+---------+
                                |
                                v
                      +---------+---------+
                      |   routes/index    |
                      +----+---------+----+
                           |         |
            /api/register  |         |  /api/shipments
            /api/login     v         v
                      +----+----+  +----+----+
                      |  user   |  |shipment |  Routes
                      |  routes |  | routes  |
                      +----+----+  +----+----+
                           |         |
                           |  [Validation Middleware (Joi)]
                           |  [Authentication Middleware (JWT)]
                           v         v
                      +----+----+  +----+----+
                      |  user   |  |shipment |  Controllers
                      | control |  | control |
                      +----+----+  +----+----+
                           |         |
                           v         v
                      +----+----+  +----+----+
                      |  user   |  |shipment |  Services (Business Logic)
                      | service |  | service |
                      +----+----+  +----+----+
                           |         |
                           +----+----+
                                |
                                v
                      +---------+---------+
                      |    Models Layer   |  (user.model / shipment.model)
                      +---------+---------+
                                |
                                v
                      +---------+---------+
                      |  MongoDB / Memory |  (Mongoose Database)
                      +-------------------+
```
