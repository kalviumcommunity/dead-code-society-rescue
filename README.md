# 🚚 LogiTrack API v2.0 - Refactored

A production-ready **REST API for shipment tracking** built with **Node.js**, **Express**, and **MongoDB**. 
Features secure JWT authentication, bcrypt password hashing, Joi input validation, and clean MVC architecture.

> **Set up and running in under 5 minutes.** No questions needed.

---

## 🎯 Tech Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Runtime | Node.js | 14+ |
| Framework | Express | 4.17.x |
| Database | MongoDB | 4.0+ |
| Authentication | JWT (jsonwebtoken) | 8.5.x |
| Password Hashing | bcrypt | 5.1.x |
| Input Validation | Joi | 17.9.x |
| Environment | dotenv | 8.2.x |

---

## ⚡ Quick Start (5 Minutes)

### 1️⃣ Clone & Install

```bash
# Clone the repository
git clone https://github.com/your-org/logitrack.git
cd logitrack

# Install dependencies
npm install
```

### 2️⃣ Set Up Environment

```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your values (at minimum: DATABASE_URL and JWT_SECRET)
# See "Environment Variables" section below
```

### 3️⃣ Start MongoDB

```bash
# If you have MongoDB installed locally
mongod --dbpath ./data

# OR use Docker
docker run -d -p 27017:27017 --name mongo mongo:latest
```

### 4️⃣ Start the Server

```bash
# Development (with auto-reload via nodemon)
npm run dev

# Production
npm start
```

You should see:
```
╔════════════════════════════════════╗
║  🚚 LogiTrack Backend v2.0         ║
║  ✨ MVC Architecture - Refactored  ║
║  🚀 Server running on port 3000    ║
╚════════════════════════════════════╝
```

Test it:
```bash
curl http://localhost:3000
# Response: { "message": "LogiTrack API v2.0 - Refactored", "status": "running" }
```

---

## 🔐 Environment Variables

Copy `.env.example` → `.env` and fill in these values:

| Variable | Example | Required | Description |
|----------|---------|----------|-------------|
| `PORT` | `3000` | Yes | Port the server listens on |
| `NODE_ENV` | `development` | Yes | Set to `production` for deployment |
| `DATABASE_URL` | `mongodb://localhost:27017/logitrack` | Yes | MongoDB connection string |
| `JWT_SECRET` | `your-long-random-string-min-32-chars` | Yes | Secret key for signing JWT tokens (⚠️ **MUST be 32+ chars**) |
| `JWT_EXPIRE` | `12h` | No | How long tokens remain valid (default: 12h) |

### Generate a Strong JWT_SECRET

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**⚠️ CRITICAL:** Never commit `.env` to git. It's already in `.gitignore`.

---

## 📚 API Reference

### Base URL
```
http://localhost:3000/api
```

### Authentication Routes (No token required)

#### 📝 Register New User
```http
POST /auth/register

Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Password Requirements:**
- Minimum 8 characters
- Must contain at least one uppercase letter
- Must contain at least one number

---

#### 🔑 Login
```http
POST /auth/login

Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": { ... },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Using the token:**
```bash
# Include in Authorization header
curl -H "Authorization: eyJhbGc..." http://localhost:3000/api/users/profile
```

---

### User Routes (🔒 Token required)

#### 👤 Get Your Profile
```http
GET /users/profile
Authorization: <your-jwt-token>
```

**Response (200):**
```json
{
  "message": "Profile retrieved successfully",
  "user": { ... }
}
```

---

### Shipment Routes (🔒 Token required)

#### 📦 Create Shipment
```http
POST /shipments
Authorization: <your-jwt-token>
Content-Type: application/json

{
  "origin": "New York, NY",
  "destination": "Los Angeles, CA",
  "weight": 25.5,
  "carrier": "FedEx"
}
```

**Valid Carriers:** `FedEx`, `UPS`, `DHL`, `USPS`, `Local`

**Response (201):**
```json
{
  "message": "Shipment created successfully",
  "shipment": {
    "_id": "507f1f77bcf86cd799439012",
    "trackingId": "SHIP-1705329000000-1234",
    "origin": "New York, NY",
    "destination": "Los Angeles, CA",
    "weight": 25.5,
    "carrier": "FedEx",
    "status": "pending",
    "userId": { "name": "John Doe", "email": "john@example.com", "role": "user" },
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

#### 📋 List Your Shipments
```http
GET /shipments
Authorization: <your-jwt-token>
```

**Response (200):**
```json
{
  "message": "Shipments retrieved successfully",
  "count": 3,
  "shipments": [ ... ]
}
```

---

#### 🔍 Get Single Shipment
```http
GET /shipments/:id
Authorization: <your-jwt-token>
```

---

#### ✏️ Update Shipment Status
```http
PATCH /shipments/:id/status
Authorization: <your-jwt-token>
Content-Type: application/json

{
  "status": "delivered"
}
```

**Valid Statuses:** `pending`, `in-progress`, `delivered`, `cancelled`

---

#### 🗑️ Delete Shipment
```http
DELETE /shipments/:id
Authorization: <your-jwt-token>
```

---

## 🏗 Architecture

```
Request
  ↓
┌─────────────────────────────────────┐
│ Routes (src/routes/*.routes.js)     │ ← Defines endpoints
└─────────────────────────────────────┘
  ↓
┌─────────────────────────────────────┐
│ Controllers (src/controllers/)      │ ← Handles HTTP logic
└─────────────────────────────────────┘
  ↓
┌─────────────────────────────────────┐
│ Services (src/services/)            │ ← Contains business logic
└─────────────────────────────────────┘
  ↓
┌─────────────────────────────────────┐
│ Models (models/)                    │ ← Mongoose schemas
└─────────────────────────────────────┘
  ↓
Database (MongoDB)
```

### Folder Structure
```
src/
├── routes/              # Route definitions (only HTTP mapping)
│   ├── auth.routes.js
│   ├── user.routes.js
│   └── shipment.routes.js
├── controllers/         # Request handlers (thin layer)
│   ├── auth.controller.js
│   ├── user.controller.js
│   └── shipment.controller.js
├── services/            # Business logic (where the work happens)
│   ├── auth.service.js
│   ├── user.service.js
│   └── shipment.service.js
├── middlewares/         # Express middleware
│   ├── auth.middleware.js      # JWT verification
│   ├── validate.middleware.js  # Input validation
│   └── error.middleware.js     # Centralized error handling
├── validators/          # Joi schemas for input validation
│   ├── user.validator.js
│   └── shipment.validator.js
├── utils/               # Utility functions
│   ├── errors.util.js          # Custom error classes
│   ├── hash.util.js            # bcrypt password hashing
│   └── jwt.util.js             # JWT signing/verification
├── server.js            # Main server setup
└── app.js               # Application entry point

models/
├── User.model.js        # User schema
└── Shipment.model.js    # Shipment schema
```

---

## 🔒 Security Features

✅ **Passwords:** Hashed with bcrypt (12 salt rounds) — **NOT MD5**  
✅ **Input Validation:** All endpoints validate with Joi — prevents NoSQL injection  
✅ **JWT Auth:** Secure token-based authentication  
✅ **Authorization:** Permission checks on protected endpoints  
✅ **Secrets:** `.env` is in `.gitignore` — never exposed in git  
✅ **Error Handling:** Centralized error middleware — consistent responses  

---

## 🐛 Development

### Run Tests
```bash
npm test
```

### Enable Debug Logging
```bash
DEBUG=logitrack:* npm run dev
```

### Linting (if configured)
```bash
npm run lint
```

---

## 🚀 Deployment

### Heroku
```bash
heroku login
heroku create your-app-name
git push heroku main

# Set environment variables
heroku config:set DATABASE_URL=your-mongodb-atlas-url
heroku config:set JWT_SECRET=your-long-secret
```

### Docker
```bash
docker build -t logitrack .
docker run -p 3000:3000 --env-file .env logitrack
```

### Environment for Production
```bash
# In .env for production:
NODE_ENV=production
PORT=8080
DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/logitrack
JWT_SECRET=<very-long-random-string-32+-chars>
```

---

## 📖 What Changed (v2.0)

This is a **complete refactoring** of the v1.0 spaghetti code. See [AUDIT.md](AUDIT.md) for detailed analysis and [CHANGELOG.md](CHANGELOG.md) for all changes.

**Key Improvements:**
- ✅ MD5 → bcrypt for password hashing
- ✅ No input validation → Joi validation on all endpoints
- ✅ God file → Clean MVC architecture
- ✅ Duplicate auth blocks → Centralized auth middleware
- ✅ N+1 queries → Fixed with .populate()
- ✅ Scattered error handling → Centralized error middleware
- ✅ No documentation → Complete JSDoc + README

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---

## 📞 Support

- 📖 **API Docs:** See "API Reference" above
- 🐛 **Issues:** Open a GitHub issue
- 💬 **Questions:** Check [FAQ](FAQ.md) or reach out to the team

---

## 📄 License

ISC — See [LICENSE](LICENSE) for details

---

**Built with ❤️ by the Dead Code Society Rescue Team**  
*Because dead code deserves a chance to live again.*

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
