# 🚚 LogiTrack API

LogiTrack is a secure, clean, and optimized shipment tracking platform backend designed for small businesses to manage and track shipments with role-based access control.

## 🏛 Architecture

```
+-------------------------------------------------------------+
|                        Express App                          |
+-------------------------------------------------------------+
                              |
                     [ Routing Layer ]
            /api/register | /api/login | /api/shipments
                              |
                     [ Validation Middleware ]
                           (Joi)
                              |
                    [ Auth Middleware ]
                           (JWT)
                              |
                    [ Controller Layer ]
            (auth.controller, shipment.controller)
                              |
                     [ Service Layer ]
              (auth.service, shipment.service)
                              |
                      [ Model Layer ]
                (Mongoose: User, Shipment)
                              |
                     [ MongoDB Database ]
```

## 🛠 Tech Stack

| Technology | Implementation | Description |
|------------|----------------|-------------|
| **Runtime** | Node.js | v14+ compatible server environment |
| **Framework** | Express | Lightweight web framework for routing and middleware |
| **Database** | MongoDB + Mongoose | NoSQL database with ODM schema modeling |
| **Auth** | JWT (jsonwebtoken) | Token-based stateless authentication |
| **Validation** | Joi | Declarative schema validation for request payloads |
| **Hashing** | bcrypt (12 rounds) | Timing-safe key derivation function for password hashing |

## 🚀 Quick Start

Follow these steps to set up and run the application locally:

### 1. Clone the Repository
```bash
git clone https://github.com/kalviumcommunity/dead-code-society-rescue.git
cd dead-code-society-rescue
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Copy the example environment file and configure variables:
```bash
cp .env.example .env
```

### 4. Run the Application
Run the development server with live reload:
```bash
npm run dev
```
Or start the server in production mode:
```bash
npm start
```

## 📝 Environment Variables

| Name | Example | Required | Description |
|------|---------|----------|-------------|
| `PORT` | `3000` | No | Port on which the Express server listens (default: 3000) |
| `DATABASE_URL` | `mongodb://localhost:27017/logitrack` | Yes | Connection string to MongoDB database |
| `JWT_SECRET` | `super_secret_logitrack_2019_dont_share` | Yes | Private key to sign and verify JSON Web Tokens |

## 📡 API Reference

All routes are nested under `/api`.

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| `POST` | `/api/register` | No | Creates a new user account with hashed password. Returns `201 Created` |
| `POST` | `/api/login` | No | Authenticates user by email/password. Returns JWT |
| `GET` | `/api/profile` | Yes | Returns the profile details of the authenticated user |
| `GET` | `/api/shipments` | Yes | Retrieves all shipments for the authenticated user (populated user details) |
| `GET` | `/api/shipments/:id` | Yes | Retrieves details of a specific shipment (accessible by owner or admin) |
| `POST` | `/api/shipments` | Yes | Creates a new shipment under the authenticated user. Returns `201 Created` |
| `PATCH` | `/api/shipments/:id/status` | Yes | Updates status of shipment. Changing status to `delivered` requires admin role |
| `DELETE` | `/api/shipments/:id` | Yes | Deletes a shipment. Requires user to be the owner of the shipment or admin |
| `GET` | `/api/status` | No | System health diagnostics (OS type, uptime, memory usage) |
| `GET` | `/api/ping` | No | Quick connectivity test (returns `{ "pong": "active" }`) |
