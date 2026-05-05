# 🚚 LogiTrack API v1.0.0

Welcome to the **LogiTrack** backend! This is the core API for our internal shipment tracking system. Built with Node.js, Express, and MongoDB for speed and reliability.

## 📦 What is LogiTrack?

LogiTrack helps our logistics team manage shipments across the globe. It handles everything from user registration to real-time status updates and shipment management.

## 🛠 Features

- 🔐 **Secure Auth**: JWT authentication for all users
- 👤 **User Profiles**: Manage your account and roles
- 📦 **Shipment Tracking**: Create and track shipments with ease
- 🚫 **Role Management**: Admin-only routes for status changes
- 🧪 **Input Validation**: Joi validation on all relevant endpoints
- 🛡️ **Centralized Error Handling**: All errors handled in one place, with clear messages
- 🏗️ **MVC Structure**: Controllers, validators, and middlewares for maintainability

## 🚀 Getting Started

Get up and running in under 5 minutes:

### 1. Clone & Install

```bash
git clone <repo-url>
cd dead-code-society-rescue
npm install
cp .env.example .env
# Edit .env with your MongoDB connection string and JWT secret
```

### 2. Start the Server

```bash
npm run dev
# or
npm start
```

### 3. Test the API

Use Postman, curl, or your favorite tool to hit the endpoints below.

## 📝 API Endpoints

All endpoints are prefixed with `/api`:

| Method | Endpoint                | Description           |
| ------ | ----------------------- | --------------------- |
| POST   | `/register`             | Create a new account  |
| POST   | `/login`                | Get your token        |
| GET    | `/profile`              | Get your profile      |
| GET    | `/shipments`            | View your shipments   |
| POST   | `/shipments`            | Create new shipment   |
| PATCH  | `/shipments/:id/status` | Update status (Admin) |
| DELETE | `/shipments/:id`        | Delete a shipment     |

## 🧑‍💻 Architecture

- All business logic is in `src/controllers/`
- Validation is in `src/validators/`
- Errors are handled by `src/middlewares/error.middleware.js`
- Custom error classes in `src/utils/errors.util.js`

## 🩺 Health & Status

- `/api/status` — Server info
- `/api/ping` — Health check

## 🛡️ Error Handling

All errors are returned in a consistent format:

```json
{
  "error": "Message",
  "statusCode": 400
}
```

See `src/middlewares/error.middleware.js` for details.

## 📝 Documentation

- All controllers are documented with JSDoc.
- See `CHANGELOG.md` for recent changes.
- See `AUDIT.md` for legacy issues and their resolution status.

---

### 🛠 Author

_Created with ❤️ by Senior Junior Developer_

#####

**Note**: If you have issues with the database connection, check your .env file and MongoDB status.
