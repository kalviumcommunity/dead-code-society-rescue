# LogiTrack Backend Platform

## 1. Project Overview
This repository contains the backend infrastructure for the **LogiTrack** shipment tracking platform, tailored for small businesses. It handles user authentication, role-based access control, and comprehensive logistics management, allowing users to securely track shipments from origin to destination.

## 2. Tech Stack

| Technology | Purpose |
| ---------- | ------- |
| **Node.js** | JavaScript runtime environment |
| **Express.js** | Core web framework for REST API routing |
| **MongoDB** | NoSQL database for document persistence |
| **Mongoose** | Object Data Modeling (ODM) layer for schema enforcement |
| **JWT** | JSON Web Tokens for stateless authentication |
| **Joi** | Request payload validation |
| **bcrypt** | Cryptographic hashing for secure password storage |

## 3. Quick Start Setup

To get the backend running locally:

```bash
# 1. Clone the repository
git clone <repository-url>
cd logitrack-backend

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env

# 4. Start the development server
npm run dev
```

## 4. Environment Variables

Create a `.env` file in the root directory. Below is the required configuration:

| Variable | Required | Example Value | Description |
| -------- | -------- | ------------- | ----------- |
| `DATABASE_URL` | **Yes** | `mongodb://localhost:27017/logitrack` | Full MongoDB connection string URI |
| `JWT_SECRET` | **Yes** | `super-secret-key-123` | Cryptographic key used to sign Auth tokens |
| `PORT` | No | `3000` | Port on which the API server listens |

## 5. Full API Reference

| Method | Endpoint | Auth Required | Description |
| ------ | -------- | ------------- | ----------- |
| `POST` | `/api/register` | No | Creates a new user account |
| `POST` | `/api/login` | No | Authenticates a user and returns a JWT |
| `GET` | `/api/profile` | **Yes** | Retrieves the currently authenticated user's profile |
| `GET` | `/api/shipments` | **Yes** | Retrieves all shipments belonging to the user |
| `GET` | `/api/shipments/:id` | **Yes** | Retrieves a specific shipment by its tracking ID |
| `POST` | `/api/shipments` | **Yes** | Creates a new shipment |
| `PATCH`| `/api/shipments/:id/status` | **Yes** | Updates the delivery status of a shipment (Admin privileges required for 'delivered') |
| `DELETE`|`/api/shipments/:id` | **Yes** | Deletes a shipment |

## 6. Architecture Diagram

The application implements a strict Model-View-Controller (MVC) architectural pattern:

```text
Incoming HTTP Request
        │
        ▼
   [ Middlewares ] (Joi Validation, JWT Auth)
        │
        ▼
     [ Routes ]    (URL routing)
        │
        ▼
  [ Controllers ]  (Req/Res handling, Error Catching)
        │
        ▼
   [ Services ]    (Business Logic, DB Queries)
        │
        ▼
    [ Models ]     (Mongoose Schemas)
        │
        ▼
   [ MongoDB ]     (Data Storage)
```
