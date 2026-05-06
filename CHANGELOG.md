# CHANGELOG

## [Unreleased]

### Security
- Replaced MD5 password hashing with bcrypt via shared hash utilities.
- Centralized JWT verification in auth middleware.
- Added request validation with Joi and `stripUnknown: true`.

### Architecture
- Added an MVC scaffold with routes, controllers, services, models, middlewares, validators, and utils.
- Moved shipment listing to `populate()` to remove the N+1 query pattern.
- Added centralized error handling and custom error classes.

### Documentation
- Added a production-style README with setup steps, environment variables, and API reference.
- Added an audit document summarizing code smells and the fixes applied.

### Verification
- Confirmed the app starts on a free port.
- Confirmed the `/api/status` endpoint responds successfully.
- Confirmed Joi validation returns a structured 422 response for invalid user registration payloads.
