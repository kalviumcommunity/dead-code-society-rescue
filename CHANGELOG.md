# CHANGELOG

## [Refactored] - 2026-05-06

### Security Fixes
- Replaced MD5 password hashing with bcrypt using 12 salt rounds.
- Added input validation with Joi and stripped unknown request fields.
- Ignored .env files in git to prevent secret leakage.

### Architecture Refactors
- Split the monolithic routes file into routes, controllers, services, models, middlewares, utils, and validators.
- Added centralized error handling for consistent API responses.
- Converted the app bootstrap into a reusable Express app plus a separate server entrypoint.

### Performance Fixes
- Removed the N+1 shipment listing pattern by using Mongoose populate.

### Documentation
- Added an audit log, updated README instructions, and documented the API surface.
- Added JSDoc to exported controllers, services, middlewares, and utility helpers.
- Added a shared response helper to standardize JSON success responses.