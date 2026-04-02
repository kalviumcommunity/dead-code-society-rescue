# LogiTrack API - Production Solution

A fully refactored, production-grade logistics and shipment tracking API built with Node.js, Express, and MongoDB.

## Features
- **MVC Architecture**: Strict separation of concerns (Routes, Controllers, Services, Models).
- **Security**:
  - Secure password hashing using `bcrypt` (12 salt rounds).
  - JWT authentication with Bearer tokens.
  - Environment variable validation for critical secrets.
- **Robust Validation**: `Joi` schema validation on all inputs.
- **Error Handling**: Centralized error middleware with custom error classes.
- **Performance**: Optimized database queries with population to avoid N+1 problems.
- **Clean Code**: Full `async/await` syntax, `const/let` only, and complete JSDoc documentation.

## Getting Started

1.  **Clone the Repository**
2.  **Install Dependencies**
    ```bash
    npm install
    ```
3.  **Environment Variables**
    Create a `.env` file (copied from `.env.example` OR use the one provided):
    ```env
    PORT=5000
    MONGODB_URI=mongodb://localhost:27017/logitrack
    JWT_SECRET=your_jwt_secret
    NODE_ENV=development
    ```
4.  **Run the Server**
    ```bash
    # Development mode
    npm run dev

    # Production mode
    npm start
    ```

## API Documentation

### Auth
- `POST /api/auth/register` - Create a new account
- `POST /api/auth/login` - Login and receive JWT

### Users
- `GET /api/users/profile` - Get your profile details (Protected)
- `PATCH /api/users/profile` - Update your profile (Protected)

### Shipments
- `GET /api/shipments` - List all shipments with tracking and user data (Protected)
- `POST /api/shipments` - Create a new shipment (Protected)
- `GET /api/shipments/:trackingNumber` - Get details of a single shipment (Protected)
- `PATCH /api/shipments/:trackingNumber` - Update shipment status or details (Protected)
- `DELETE /api/shipments/:trackingNumber` - Remove a shipment (Protected)
