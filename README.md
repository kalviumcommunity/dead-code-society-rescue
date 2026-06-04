# LogiTrack Backend

LogiTrack is a Node.js + MongoDB API for managing shipments and users. This repository uses Express and Mongoose, and now follows a simple MVC layout.

## Features
- JWT authentication for users
- Shipment creation and tracking
- Admin-only delivery status updates
- Centralized error handling and input validation

## Project Structure
```
src/
	app.js
	config/
		db.js
	controllers/
	middlewares/
	models/
	routes/
	utils/
	validators/
```

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
Create a `.env` file (see `.env.example`):

```
PORT=3000
DATABASE_URL=mongodb://localhost:27017/logitrack
JWT_SECRET=change_me
BCRYPT_SALT_ROUNDS=12
```

### 3. Start the server
```bash
npm run dev
```

## API Endpoints
All routes are under `/api`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Create a new account |
| POST | `/login` | Get a JWT token |
| GET | `/shipments` | List shipments for current user |
| GET | `/shipments/:id` | Get shipment details |
| POST | `/shipments` | Create shipment |
| PATCH | `/shipments/:id/status` | Update shipment status |
| DELETE | `/shipments/:id` | Delete shipment |
| GET | `/profile` | Current user profile |
| GET | `/status` | Health status |
| GET | `/ping` | Ping endpoint |

## Notes
- JWT must be passed via `Authorization: Bearer <token>`.
- Admin-only delivery updates are enforced when status is `delivered`.

## Scripts
- `npm run dev` start in watch mode
- `npm start` run in production
