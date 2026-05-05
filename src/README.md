# LogiTrack Backend — Codebase Rescue

## Overview

This project is a refactored and secured backend system for a shipment tracking platform.
The original codebase was monolithic, insecure, and difficult to maintain.

This rescue focuses on:

* Clean architecture (MVC)
* Security improvements
* Performance optimization
* Proper validation and error handling

---

## Tech Stack

| Category       | Technology |
| -------------- | ---------- |
| Runtime        | Node.js    |
| Framework      | Express.js |
| Database       | MongoDB    |
| ORM            | Mongoose   |
| Authentication | JWT        |
| Validation     | Joi        |
| Hashing        | bcrypt     |

---

## Quick Start

### 1. Clone the repo

```
bash
git clone <your-repo-link>
cd dead-code-society-rescue
```

### 2. Install dependencies

```
bash
npm install
```

### 3. Setup environment variables

Create `.env` file:

```
env
DATABASE_URL=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

### 4. Run the server

```
bash
npm run dev
```

Server runs at:

```
text
http://localhost:3000
```

---

## Authentication

All protected routes require a JWT token:

```
text
Authorization: <your_token>
```

---

## API Endpoints

| Method | Endpoint                  | Auth | Description         |
| ------ | ------------------------- | ---- | ------------------- |
| POST   | /api/auth/register        | ❌    | Register user       |
| POST   | /api/auth/login           | ❌    | Login user          |
| GET    | /api/shipments            | ✅    | Get all shipments   |
| GET    | /api/shipments/:id        | ✅    | Get single shipment |
| POST   | /api/shipments            | ✅    | Create shipment     |
| PATCH  | /api/shipments/:id/status | ✅    | Update status       |
| DELETE | /api/shipments/:id        | ✅    | Delete shipment     |

---

## Architecture

```
text
src/
├── routes/        → API endpoints
├── controllers/   → request/response logic
├── services/      → business logic
├── middlewares/   → auth, validation, error handling
├── validators/    → Joi schemas
├── utils/         → helpers and error classes
```

---

## Security Improvements

* Replaced MD5 with bcrypt for password hashing
* Implemented JWT authentication middleware
* Added input validation using Joi
* Removed insecure direct object spreading
* Added proper authorization checks

---

## Performance Improvements

* Fixed N+1 query issue using Mongoose populate
* Optimized async operations using async/await

---

## Code Quality Improvements

* Refactored monolithic file into MVC architecture
* Removed unused imports
* Replaced var with const/let
* Added centralized error handling

---

