# Changelog

## [1.0.0] - 2026-05-05

### Added

- Centralized error handling with custom error classes and middleware
- MVC structure: controllers, validators, middlewares
- Secure authentication with JWT and bcrypt
- Input validation with Joi for all relevant routes
- User and Shipment Mongoose models
- JSDoc comments for all controllers

### Changed

- Fixed N+1 query in shipment controller (now uses populate)
- All controllers now use async/await and pass errors to middleware
- Removed all inline error responses

### Removed

- Insecure MD5 password logic
- Inline JWT checks in controllers
- Unused/duplicate code in routes

---

See AUDIT.md for legacy issues and their resolution status.
