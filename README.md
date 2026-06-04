# LogiTrack Backend

REST API for shipment tracking built with Node.js, Express, MongoDB, JWT authentication, Joi validation, and bcrypt password hashing.

---

## Tech Stack

| Layer            | Technology         |
| ---------------- | ------------------ |
| Runtime          | Node.js            |
| Framework        | Express            |
| Database         | MongoDB + Mongoose |
| Authentication   | JWT                |
| Validation       | Joi                |
| Password Hashing | bcrypt             |

---

## Installation

### Clone Repository

```bash
git clone <repository-url>
cd logitrack-backend
```

### Install Dependencies

```bash
npm install
```

### Create Environment File

Create `.env`

```env
PORT=3000
DATABASE_URL=mongodb://localhost:27017/logitrack
JWT_SECRET=your-secret-key
```

### Run Development Server

```bash
npm run dev
```

### Run Production Server

```bash
npm start
```

---

## Environment Variables

| Variable     | Required | Description                |
| ------------ | -------- | -------------------------- |
| PORT         | Yes      | Application port           |
| DATABASE_URL | Yes      | MongoDB connection string  |
| JWT_SECRET   | Yes      | Secret key for JWT signing |

---

## API Endpoints

### Authentication

| Method | Endpoint           | Description                 |
| ------ | ------------------ | --------------------------- |
| POST   | /api/auth/register | Register a new user         |
| POST   | /api/auth/login    | Login and receive JWT token |

### Shipments

| Method | Endpoint                  | Description            |
| ------ | ------------------------- | ---------------------- |
| GET    | /api/shipments            | Get all user shipments |
| GET    | /api/shipments/:id        | Get shipment by ID     |
| POST   | /api/shipments            | Create shipment        |
| PATCH  | /api/shipments/:id/status | Update shipment status |
| DELETE | /api/shipments/:id        | Delete shipment        |

### Utility

| Method | Endpoint    | Description   |
| ------ | ----------- | ------------- |
| GET    | /api/status | Health check  |
| GET    | /api/ping   | Ping endpoint |

---

## Authentication

Protected routes require JWT token:

```http
Authorization: Bearer <token>
```

---

## Project Structure

```text
src/
├── controllers/
├── services/
├── routes/
├── middlewares/
├── validators/
├── utils/
├── models/
├── app.js
└── server.js
```

---

## Architecture

Request
↓
Routes
↓
Controllers
↓
Services
↓
Models
↓
MongoDB

---

## Improvements Implemented

* Replaced MD5 with bcrypt
* Added Joi validation
* Added centralized error handling
* Added authentication middleware
* Converted promise chains to async/await
* Fixed N+1 query problem using populate()
* Implemented MVC architecture
* Added JSDoc documentation
* Added authorization checks
* Removed unused imports and dead code
