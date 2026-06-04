# LogiTrack API

## Overview

LogiTrack is a backend API for managing users and shipments. It provides registration and login, shipment creation and tracking, role-aware status updates, and basic health endpoints.

## Tech Stack

| Category     | Choice             |
| ------------ | ------------------ |
| Runtime      | Node.js            |
| Framework    | Express            |
| Database     | MongoDB            |
| ODM          | Mongoose           |
| Auth         | JWT (jsonwebtoken) |
| Validation   | Joi                |
| Hashing      | bcrypt             |
| Config       | dotenv             |
| HTTP Helpers | body-parser, cors  |
| Dev Tools    | nodemon            |

## Quick Start

1. Install dependencies

```bash
npm install
```

2. Configure environment

```bash
copy .env.example .env
```

3. Start the server

```bash
npm run dev
```

The API listens on `http://localhost:3000` by default.

## Environment Variables

| Name         | Example                                | Required | Description                   |
| ------------ | -------------------------------------- | -------- | ----------------------------- |
| PORT         | 3000                                   | No       | Port for the HTTP server      |
| DATABASE_URL | mongodb://localhost:27017/logitrack    | Yes      | MongoDB connection string     |
| JWT_SECRET   | super_secret_logitrack_2019_dont_share | Yes      | Signing secret for JWT tokens |

## API Reference

All endpoints are under the `/api` prefix.

| Method | Endpoint              | Auth Required | Description                                  |
| ------ | --------------------- | ------------- | -------------------------------------------- |
| POST   | /register             | No            | Create a new user account                    |
| POST   | /login                | No            | Authenticate and receive a JWT               |
| GET    | /shipments            | Yes           | List shipments for the current user          |
| GET    | /shipments/:id        | Yes           | Fetch a specific shipment by id              |
| POST   | /shipments            | Yes           | Create a shipment                            |
| PATCH  | /shipments/:id/status | Yes           | Update a shipment status (admin can deliver) |
| DELETE | /shipments/:id        | Yes           | Delete a shipment by id                      |
| GET    | /profile              | Yes           | Get the current user profile                 |
| GET    | /status               | No            | Health info for the service                  |
| GET    | /ping                 | No            | Simple liveness check                        |

## Architecture (ASCII)

```
		  +----------------------+
		  |  Client / API User   |
		  +----------+-----------+
					 |
					 v
		  +----------------------+
		  |     Express App      |
		  |   /api routes        |
		  +----------+-----------+
					 |
					 v
		  +----------------------+
		  |   Controllers        |
		  +----------+-----------+
					 |
					 v
		  +----------------------+
		  |    Services          |
		  +----------+-----------+
					 |
					 v
		  +----------------------+
		  |   Mongoose Models    |
		  +----------+-----------+
					 |
					 v
		  +----------------------+
		  |     MongoDB          |
		  +----------------------+
```
