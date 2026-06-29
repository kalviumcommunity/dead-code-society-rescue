# LogiTrack Backend

Logistics and shipment tracking application backend. Rescued from a flat, insecure script into a modern, robust REST API built with Express and MongoDB.

## Tech Stack

| Component | Technology |
|---|---|
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **Database** | MongoDB (via Mongoose) |
| **Authentication** | JWT (JSON Web Tokens) |
| **Validation** | Joi |
| **Hashing** | bcrypt (12 rounds) |

## Quick Start

1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   cd dead-code-society-rescue
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   ```bash
   cp .env.example .env
   ```
   Fill in `DATABASE_URL` and `JWT_SECRET` in `.env`.

4. **Run the server:**
   ```bash
   npm run dev
   ```

## Environment Variables

| Variable | Example | Required | Description |
|---|---|---|---|
| `PORT` | `3000` | No | The port the server runs on. |
| `DATABASE_URL` | `mongodb://localhost:27017/logitrack` | Yes | MongoDB connection string. |
| `JWT_SECRET` | `supersecret123` | Yes | Secret key used to sign JWTs. |

## API Reference

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| **POST** | `/api/auth/register` | No | Register a new user |
| **POST** | `/api/auth/login` | No | Login and get a JWT token |
| **GET** | `/api/users/profile` | Yes | Get the authenticated user's profile |
| **GET** | `/api/shipments` | Yes | Get all shipments for the authenticated user |
| **POST** | `/api/shipments` | Yes | Create a new shipment |
| **GET** | `/api/shipments/:id` | Yes | Get a single shipment by ID |
| **PATCH**| `/api/shipments/:id/status` | Yes (Admin) | Update shipment status (Admin only) |
| **DELETE**|`/api/shipments/:id` | Yes | Delete a shipment |

## Architecture Diagram

```
+----------------+      +----------------+      +-----------------+
|   Client App   | ---> |  Express API   | ---> |     MongoDB     |
| (Postman/Curl) |      | (Middlewares,  |      |   (Mongoose)    |
+----------------+      |  Controllers)  |      +-----------------+
                              |
                              v
                        +----------------+
                        |    Services    |
                        | (Business Logic)|
                        +----------------+
```
