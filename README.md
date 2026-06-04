# 🚚 LogiTrack API Backend

Welcome to the **LogiTrack** backend! This is a production-ready, refactored backend server for the LogiTrack shipment tracking platform, engineered with high standards of security, clean architecture, and performance.

---

## 🛠 Tech Stack

| Technology | Category | Description |
| :--- | :--- | :--- |
| **Node.js** | Runtime | Event-driven JavaScript runtime environment |
| **Express.js** | Framework | High-performance, minimalist web framework |
| **MongoDB** | Database | Document-based NoSQL database |
| **Mongoose** | ODM | Elegant MongoDB object modeling for Node.js |
| **bcrypt** | Hashing | Adaptive password hashing function (12 rounds) |
| **jsonwebtoken** | Auth | Standardized JSON Web Tokens (JWT) for session management |
| **Joi** | Validation | Schema-based payload validation middleware |

---

## 🏗 System Architecture (MVC Pattern)

Below is the structured data flow diagram illustrating the Separation of Concerns implemented in this codebase:

```text
                  +-----------------------------------+
                  |            HTTP Client            |
                  |          (Postman/curl/UI)        |
                  +-----------------+-----------------+
                                    |
                                    v [HTTP Request]
                  +-----------------+-----------------+
                  |           Express app.js          |
                  +-----------------+-----------------+
                                    |
                                    v [Middleware Pipeline]
         +--------------------------+--------------------------+
         |                                                     |
         v [Validation Middleware]                             v [Authentication Middleware]
  +------+------+                                       +------+------+
  | Joi Schemas |                                       | jwt.verify  |
  +-------------+                                       +-------------+
         |                                                     |
         +--------------------------+--------------------------+
                                    |
                                    v [Routing Layer]
                  +-----------------+-----------------+
                  |        Express Router Index       |
                  |     (/api/auth, /api/shipments)   |
                  +-----------------+-----------------+
                                    |
                                    v [Controllers]
                  +-----------------+-----------------+
                  |   AuthController / ShipmentCtrl   |
                  +-----------------+-----------------+
                                    |
                                    v [Services (Business Logic)]
                  +-----------------+-----------------+
                  |  AuthService / ShipmentService   |
                  +-----------------+-----------------+
                                    |
                                    v [Models (Mongoose Schemas)]
                  +-----------------+-----------------+
                  |       User / Shipment Models      |
                  +-----------------+-----------------+
                                    |
                                    v [Database]
                  +-----------------+-----------------+
                  |             MongoDB               |
                  +-----------------------------------+
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+ recommended)
- MongoDB running locally or a MongoDB Atlas URI

### Setup Instructions

1. **Clone the repository and navigate to the directory:**
   ```bash
   git clone https://github.com/kalviumcommunity/dead-code-society-rescue.git
   cd dead-code-society-rescue
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Configure the environment file:**
   ```bash
   cp .env.example .env
   ```
   Open `.env` in a text editor and fill in the configuration values.

4. **Start the server in Development mode:**
   ```bash
   npm run dev
   ```
   Or start in **Production mode**:
   ```bash
   npm start
   ```

---

## ⚙ Environment Variables

| Variable | Example | Required | Description |
| :--- | :--- | :--- | :--- |
| `PORT` | `3000` | No | Port on which the Express server listens. Defaults to `3000`. |
| `DATABASE_URL` | `mongodb://localhost:27017/logitrack` | Yes | Connection string for MongoDB. |
| `JWT_SECRET` | `super_secret_logitrack_2019_dont_share` | Yes | Symmetric secret key used to sign and verify JWT authentication tokens. |

---

## 📝 API Reference

All requests must be prefixed with `/api`.

| Method | Endpoint | Auth Required | Payload (Body) Schema | Description |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/register` | No | `{ name, email, password, role }` | Registers a new user. Plaintext passwords are secure-hashed. Returns HTTP `201 Created`. |
| **POST** | `/login` | No | `{ email, password }` | Authenticates user credentials. Returns signed JWT token. |
| **GET** | `/profile` | Yes | None | Retrieves the profile details of the authenticated user. |
| **GET** | `/shipments` | Yes | None | Lists all shipments belonging to the authenticated user. N+1 queries optimized out. |
| **POST** | `/shipments` | Yes | `{ origin, destination, weight, carrier }` | Creates a new shipment under the authenticated user. Returns HTTP `201 Created`. |
| **GET** | `/shipments/:id` | Yes | None | Retrieves a shipment by ID (only owner or admin). |
| **PATCH** | `/shipments/:id/status` | Yes | `{ status }` | Updates shipment status. Only admins can transition to `delivered`. |
| **DELETE** | `/shipments/:id` | Yes | None | Deletes a shipment (only owner or admin). |
| **GET** | `/status` | No | None | Retrieves server OS and system specifications. |
| **GET** | `/ping` | No | None | Endpoint to verify if server is alive. Returns `{ "pong": "active" }`. |
