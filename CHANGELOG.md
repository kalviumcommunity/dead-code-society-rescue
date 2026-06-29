# Changelog

## [1.1.0] - 2026-06-29

### Added
- MVC-style folder structure under src for routes, controllers, services, models, middlewares, and utils
- Joi validation middleware for registration, login, shipment creation, and status updates
- Centralized error middleware for consistent API error responses
- JSDoc comments for exported functions

### Changed
- Replaced MD5 password hashing with bcryptjs
- Extracted auth logic into reusable middleware
- Moved shipment lookups to populate-based queries to avoid N+1 issues
- Reworked the app entry point to use the new modular router structure

### Fixed
- Removed duplicated route-level auth and error handling patterns
- Improved input validation and authorization checks for shipment operations
