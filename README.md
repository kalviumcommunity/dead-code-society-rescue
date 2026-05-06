# LogiTrack Backend

REST API for shipment tracking built using Node.js, Express, and MongoDB.

---

# Features

- User Registration
- User Login with JWT Authentication
- Shipment Creation
- Shipment Status Update
- Protected Routes
- Joi Validation
- Centralized Error Handling
- MVC Architecture
- bcrypt Password Hashing
- MongoDB Integration

---

# Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Authentication | JWT |
| Validation | Joi |
| Password Hashing | bcrypt |
| Development Tool | Nodemon |

---

# Project Structure

```txt
src/
├── controllers/
├── middlewares/
├── routes/
├── services/
├── utils/
├── validators/
├── app.js
MVC Architecture
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
Installation
Clone Repository
git clone <your-github-repo-url>
cd dead-code-society-rescue
Install Dependencies
npm install
Create Environment File

Create a .env file in the root folder.

Example:

DATABASE_URL=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=3000
Run Project
npm run dev

Server runs on:

http://localhost:3000
API Endpoints
Authentication
Method	Endpoint	Description
POST	/api/auth/register	Register new user
POST	/api/auth/login	Login user
Shipments
Method	Endpoint	Description
GET	/api/shipments	Get all shipments
GET	/api/shipments/:id	Get shipment by ID
POST	/api/shipments	Create shipment
PATCH	/api/shipments/:id/status	Update shipment status
DELETE	/api/shipments/:id	Delete shipment
Utility Routes
Method	Endpoint	Description
GET	/api/status	Server status
GET	/api/ping	Ping route
Example Request
Register User
POST /api/auth/register
{
  "name": "Kishore",
  "email": "kishore@test.com",
  "password": "123456",
  "role": "user"
}
Login User
POST /api/auth/login
{
  "email": "kishore@test.com",
  "password": "123456"
}
Authorization

Protected routes require JWT token.

Example:

Authorization: <your_token>
Validation

Joi validation is used for:

User Registration
User Login
Shipment Creation

Invalid requests return:

{
  "errors": [
    "\"email\" must be a valid email"
  ]
}
Security Improvements
Replaced MD5 with bcrypt
Added JWT authentication middleware
Added Joi input validation
Removed .env from Git tracking
Centralized error handling added
Performance Improvements
Fixed N+1 query issue using populate()
Replaced Promise chains with async/await
Code Quality Improvements
Refactored into MVC architecture
Replaced var with const/let
Added JSDoc comments
Removed duplicate authentication logic
Testing

API testing can be done using:

Postman
Thunder Client
Environment Variables
Variable	Required	Description
DATABASE_URL	Yes	MongoDB connection string
JWT_SECRET	Yes	Secret key for JWT
PORT	No	Server port
Future Improvements
Role-based authorization
Refresh tokens
Rate limiting
API documentation with Swagger
Unit testing