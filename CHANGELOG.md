# Changelog

All notable changes to the LogiTrack Rescue project will be documented in this file.

## [2.0.0] - REBUILT
### Added
- **MVC Architecture**: Restructured the monolithic `routes.js` into professional layers (Controllers, Services, Models, Routes).
- **Joi Validation**: Added strict schema validation for all input bodies (Register, Login, Shipment creation/update).
- **Centralized Error Handling**: Unified error response format with custom error classes and a global middleware.
- **Bcrypt Hashing**: Replaced insecure MD5 with salted bcrypt (12 rounds) for password security.
- **Access Control**: Added ownership checks for sensitive shipment operations (View, Update, Delete) and admin-only restrictions for status changes.
- **UUID Tracking IDs**: Replaced predictable `Date.now()` IDs with collision-resistant UUID fragments.
- **JSDoc Documentation**: Added professional documentation to all core services and functions.

### Fixed
- **N+1 Query Problem**: Fixed the shipment listing route by replacing the manual loop-fetch with Mongoose `.populate()`.
- **NoSQL Injection**: Restricted input processing by whitelisting fields instead of using unchecked spread operators.
- **Resource Leaks**: Fixed missing response paths and unhandled promise rejections by moving to async/await with centralized error catching.
- **Auth Redundancy**: Extracted duplicate authentication blocks into a single reusable middleware.

### Removed
- **MD5 Dependency**: Removed for security reasons.
- **Body-Parser**: Removed in favor of Express built-in JSON parsing.
- **Dead Code**: Cleaned up empty loops, unused imports, and commented-out legacy code.
