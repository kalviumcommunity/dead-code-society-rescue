# Changelog

## [1.1.0] - 2026-06-04
### Added
- MVC folder layout with controllers, routes, middlewares, validators, and utils.
- Centralized error handling and 404 responses.
- Joi validation for auth and shipment routes.
- bcrypt password hashing with configurable salt rounds.
- Shipment population to eliminate N+1 queries.

### Changed
- Converted handlers to async/await and cleaned up legacy promise chains.
- Replaced MD5 with bcrypt for password hashing.
- Enforced authorization checks on shipment deletion and status updates.
- Standardized response status codes for errors and resource creation.

### Removed
- Unused imports and dead code padding.
- Legacy routes file in favor of modular routes.
