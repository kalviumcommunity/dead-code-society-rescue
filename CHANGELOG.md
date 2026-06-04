# CHANGELOG

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-06-04 - Code Rescue Release

### Added

- **MVC Architecture:** Restructured codebase from flat structure to proper Model-View-Controller pattern
  - `src/controllers/` - HTTP request handlers with business logic delegation
  - `src/services/` - Centralized business logic layer
  - `src/routes/` - Route definitions using controllers
  - `src/middlewares/` - Reusable middleware for auth, validation, error handling
  - `src/utils/` - Helper utilities and constants
  - `src/validators/` - Joi schemas for input validation

- **Security Improvements:**
  - Replaced MD5 password hashing with bcrypt (12 rounds) for strong password hashing
  - Implemented JWT token-based authentication with 12-hour expiry
  - Added input validation middleware using Joi schemas
  - Extracted auth middleware to prevent code duplication
  - Added permission checks on shipment deletion and status updates

- **Input Validation:**
  - Joi validation schemas for all POST/PATCH endpoints
  - Validation middleware that strips unknown fields and returns 422 on failure
  - Email format validation, password strength requirements
  - Enum validation for shipment statuses and user roles

- **Error Handling:**
  - Centralized error middleware for consistent error responses
  - Custom error classes: AppError, NotFoundError, UnauthorizedError, ConflictError, ValidationError
  - Proper HTTP status codes (201 for creation, 400 for bad request, 404 for not found, etc.)
  - Error details included in response for better debugging

- **Performance Optimizations:**
  - Fixed N+1 query problem using Mongoose `.populate()` instead of loop queries
  - Converted promise chains to async/await for cleaner, more readable code
  - Centralized response formatting to reduce duplication

- **Code Quality Improvements:**
  - Replaced all `var` declarations with `const`/`let` for proper scoping
  - Converted `.then().catch()` chains to async/await throughout codebase
  - Removed unused imports (path, fs, http, os)
  - Added comprehensive JSDoc comments to all exported functions
  - Added enum validation to Mongoose schemas

- **Documentation:**
  - Comprehensive README.md with setup instructions, API reference, and architecture diagrams
  - API documentation with request/response examples for all endpoints
  - Environment variable configuration guide
  - CHANGELOG.md to track all changes

- **Constants Management:**
  - Centralized magic strings into `src/utils/constants.util.js`
  - Defined SHIPMENT_STATUS and USER_ROLES enums
  - Standardized token expiry time constant

### Changed

- **Database Connection:**
  - Removed deprecated Mongoose options (useCreateIndex, useFindAndModify)
  - Converted database connection from promise chains to async/await
  - Improved error handling with early process exit on connection failure

- **Route Refactoring:**
  - Split single `routes.js` (600+ lines) into:
    - `routes/user.routes.js` - Auth endpoints
    - `routes/shipment.routes.js` - Shipment management
  - Auth block extracted from all route handlers into reusable middleware
  - Proper separation of concerns: routes → controllers → services

- **Response Format:**
  - Standardized all responses with `formatSuccessResponse()` and `formatErrorResponse()`
  - Consistent error response structure with statusCode, message, details
  - Added meaningful success messages to all endpoints

- **Shipment Service Logic:**
  - Added user ownership checks for shipment access (owner or admin)
  - Implemented admin-only restriction for "delivered" status updates
  - Added trackingId auto-generation with improved uniqueness
  - User details automatically populated via `.populate()` instead of loop queries

- **Authentication:**
  - Standardized JWT secret handling with fallback (but should be env required in production)
  - Improved error messages for auth failures (missing token, invalid token)
  - Added role-based authorization checks

### Fixed

- **Security Vulnerabilities:**
  - Fixed CRITICAL: MD5 password hashing vulnerability → now using bcrypt
  - Fixed CRITICAL: NoSQL injection via spread operator on request body → added validation
  - Fixed CRITICAL: NoSQL injection via unsanitized email → validated in schema
  - Fixed CRITICAL: Missing permission check on DELETE /shipments/:id → now checks ownership/admin

- **N+1 Query Problem:**
  - GET /shipments was making 1 + N database queries → now uses single .populate() query
  - Eliminated loop-based User lookups for each shipment

- **HTTP Status Codes:**
  - All endpoints now return appropriate status codes instead of always returning 200
  - 201 for resource creation (POST /auth/register, POST /api/shipments)
  - 400 for bad requests
  - 401 for unauthorized
  - 404 for not found
  - 409 for conflict (email already exists)
  - 422 for validation errors

- **Error Handling:**
  - Silent failures in loops (e.g., N+1 query User.findById) → now properly handled
  - Removed scattered inline try/catch blocks → centralized error handler
  - Missing error handlers (e.g., in profile GET) → now caught and handled

### Removed

- Removed use of `md5` package (security risk)
- Removed unused imports: path, fs, http, os from routes
- Removed inline error handling from all controller functions → delegated to error middleware
- Removed old flat `src/routes.js` file (replaced by MVC structure)
- Removed `useCreateIndex` and `useFindAndModify` Mongoose options (deprecated)

### Technical Debt Cleared

- Eliminated magic strings - all constants defined and reused
- Fixed variable scoping issues (var → const/let)
- Removed promise callback nesting (converted to async/await)
- Eliminated code duplication in auth checks
- Improved database query efficiency (N+1 fix)
- Standardized error responses across entire API

### Migration Notes

**For API consumers:**
- Auth token now required in `Authorization` header instead of sometimes working without
- Email format now validated - malformed emails will be rejected with 422
- Unknown fields in request body are now stripped (security feature)
- Error responses now include detailed validation messages
- Some endpoints now return 201/404/409/422 instead of always 200

**For developers:**
- Import from new module locations (services, controllers, etc.)
- Use new error classes instead of catching generic errors
- New auth middleware must be applied to protected routes
- Joi schemas must be kept in sync with controller expectations

### Dependencies Added

- `bcrypt` - For secure password hashing
- `joi` - For input validation

### Dependencies Removed

- `md5` - Replaced with bcrypt (more secure)

---

## [1.0.0] - Initial Release

### Initial Features

- User registration and login
- JWT-based authentication
- Shipment CRUD operations
- Basic role-based access control (user/admin)
- MongoDB integration

### Known Issues (Fixed in 2.0.0)

- MD5 password hashing (weak)
- NoSQL injection vulnerabilities
- N+1 query problems
- No input validation
- Inconsistent error handling
- Flat file structure
- No JSDoc documentation

---

## Legend

- `Added` for new features
- `Changed` for changes in existing functionality
- `Deprecated` for soon-to-be removed features
- `Removed` for now removed features
- `Fixed` for any bug fixes
- `Security` for security issue fixes

---

**Release Date:** June 4, 2026  
**Version:** 2.0.0 (Major version bump due to breaking changes and architectural refactor)
