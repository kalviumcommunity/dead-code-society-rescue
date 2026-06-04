# 🚚 LogiTrack API v2.0.0

The core API for internal shipment tracking, rescued and rebuilt with a secure MVC architecture.

## 📦 Overview
LogiTrack helps logistics teams manage shipments securely and efficiently. This version features a complete architectural overhaul, moving from a monolithic structure to a professional, scalable MVC layout.

## 🛠 Tech Stack
| Component | Technology |
|-----------|------------|
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **Database** | MongoDB + Mongoose |
| **Auth** | JWT (JSON Web Tokens) |
| **Hashing** | Bcrypt (12 Rounds) |
| **Validation** | Joi |
| **IDs** | UUID v4 (Tracking IDs) |

## 🚀 Quick Start

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/kalviumcommunity/dead-code-society-rescue.git
cd dead-code-society-rescue
npm install
```

### 2. Environment Setup
Copy the example environment file and fill in your details:
```bash
cp .env.example .env
```

### 3. Run the Application
Start the development server with nodemon:
```bash
npm run dev
```
Or start in production mode:
```bash
npm start
```

## 🔐 Environment Variables
| Variable | Example | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server listening port |
| `DATABASE_URL` | `mongodb://localhost:27017/logitrack` | MongoDB connection URI |
| `JWT_SECRET` | `your_secret_here` | Secret key for JWT signing |

## 📝 API Reference
Base URL: `/api`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | No | Create a new user account |
| POST | `/login` | No | Authenticate and get JWT token |
| GET | `/profile` | Yes | Get current user's profile |
| GET | `/shipments` | Yes | List user's shipments |
| GET | `/shipments/:id` | Yes | Get shipment details |
| POST | `/shipments` | Yes | Create a new shipment |
| PATCH | `/shipments/:id/status` | Yes | Update status (Admin only for 'delivered') |
| DELETE | `/shipments/:id` | Yes | Delete a shipment (Owner/Admin only) |
| GET | `/ping` | No | Server health check |

## 🏗 Architecture
```text
src/
├── controllers/    # Handle req/res and call services
├── middlewares/    # Auth, Validation, Error Handling
├── models/         # Mongoose schemas and logic
├── routes/         # API endpoint definitions
├── services/       # Business logic & DB interaction
├── utils/          # Helpers (hashing, JWT, etc)
└── validators/     # Joi validation schemas
```

---
*Maintained by the Dead Code Society Rescue Team*
