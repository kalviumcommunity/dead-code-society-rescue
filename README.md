# 🚚 LogiTrack API v1.0.0-beta-final

Welcome to the **LogiTrack** backend! This is the core API for our internal shipment tracking system. Built with Node.js and MongoDB to be fast and lightweight. 🚀

## 📦 What is LogiTrack?
LogiTrack helps our logistics team manage shipments across the globe. It handles everything from user registration to real-time status updates and shipment management.

## 🛠 Features
- 🔐 **Secure Auth**: Token-based authentication for all users.
- 👤 **User Profiles**: Manage your account and roles.
- 📦 **Shipment Tracking**: Create and track shipments with ease.
- 🚫 **Role Management**: Admin-only routes for status changes.

## 🚀 Getting Started
Setting up the project is a breeze:

### 1. Installation
Clone the repo and install the dependencies:
```bash
npm install
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
