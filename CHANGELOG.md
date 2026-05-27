# Changelog

All notable changes to the LogiTrack backend during the codebase rescue project.

## [1.0.0] - 2024-05-27

### Security Fixes
- **CRITICAL**: Replaced MD5 password hashing with bcrypt (12 rounds)
  - MD5 is not a password hashing algorithm and is instantly crackable with rainbow tables
  - bcrypt provides secure, slow hashing designed for passwords
  - Updated both registration and login flows to use bcrypt.hash() and bcrypt.compare()
- Removed md5 dependency from package.json
- Added JWT secret validation (removed weak default fallback)
- Added input validation on all POST/PUT/PATCH endpoints to prevent NoSQL injection
- Removed spread operator usage on req.body to prevent injection attacks

### Architecture Refactoring
- Restructured flat codebase into MVC architecture
  - Created `src/controllers/` for request handlers
  - Created `src/services/` for business logic
  - Created `src/middlewares/` for authentication, validation, and error handling
  - Created `src/utils/` for shared utilities (JWT, error classes)
  - Created `src/validators/` for Joi validation schemas
  - Moved models from root to `src/models/`
  - Separated routes into `src/routes/auth.routes.js` and `src/routes/shipment.routes.js`
- Extracted authentication logic into dedicated middleware
- Centralized error handling with custom error classes
- Removed duplicate authentication blocks from each route

### Code Quality Improvements
- Replaced all `var` declarations with `const` or `let`
  - Used `const` for variables that are never reassigned
  - Used `let` only for variables that need reassignment
- Rewrote all promise chains (.then().catch()) as async/await
  - Improved readability and maintainability
  - Better error handling with try/catch blocks
- Removed unused imports (path, fs, http, os)
- Replaced deprecated bodyParser with express.json()
- Removed deprecated Mongoose connection options
- Added 404 handler for unknown routes
- Removed dead code (empty loop for line padding)
- Removed commented-out old code

### Performance Optimizations
- Fixed N+1 query problem in shipments endpoint
  - Replaced database calls inside loop with .populate()
  - Reduced from N+1 queries to 1 query for fetching shipments with user details
  - Improved response time for large shipment lists

### Validation & Error Handling
- Added Joi validation middleware on all routes
  - Created validation schemas for auth (register, login)
  - Created validation schemas for shipments (create, update status)
  - Validation middleware strips unknown fields and returns 422 with error messages
- Created custom error classes:
  - `AppError` - Base error class
  - `NotFoundError` - 404 errors
  - `UnauthorizedError` - 401 errors
  - `ForbiddenError` - 403 errors
  - `ConflictError` - 409 errors
  - `ValidationError` - 422 errors
- Implemented centralized error handling middleware
  - Handles Mongoose validation errors
  - Handles Mongoose duplicate key errors
  - Handles Mongoose cast errors (invalid ObjectId)
  - Handles JWT errors (invalid token, expired token)
  - Provides appropriate HTTP status codes for all error types
- Removed inline try/catch blocks from controllers
  - Controllers now pass errors to next() for centralized handling
  - Reduced code duplication

### Documentation
- Added comprehensive JSDoc to all exported functions
  - Included @param tags with types and descriptions
  - Included @returns tags with return types
  - Included @throws tags for error conditions
- Rewrote README.md with:
  - Overview of the application
  - Tech stack table
  - Quick start instructions
  - Environment variables table
  - Complete API reference
  - Architecture diagram
  - Security features documentation
- Created AUDIT.md documenting 35 code smells found
  - 8 Critical issues
  - 12 High severity issues
  - 11 Medium severity issues
  - 4 Low severity issues
- Created this CHANGELOG.md documenting all refactoring decisions

### Dependency Updates
- Added bcrypt@^6.0.0 for secure password hashing
- Added joi@^18.2.1 for input validation
- Removed md5@^2.3.0 (insecure)
- Removed body-parser@^1.19.0 (deprecated, using express.json() instead)

### Breaking Changes
- Password hashing algorithm changed from MD5 to bcrypt
  - Existing users will need to reset their passwords
  - Old MD5 hashes are no longer compatible
- Request validation is now enforced
  - Invalid requests will return 422 instead of being processed
  - Unknown fields in request bodies are stripped
- Error response format changed
  - All errors now return consistent JSON format with success field
  - HTTP status codes now properly reflect error types

### Migration Notes
If migrating from the old version:
1. Reset all user passwords (bcrypt is not compatible with MD5)
2. Update API clients to handle new validation error responses (422 status)
3. Update API clients to include proper Authorization headers
4. Ensure all requests include only valid fields (unknown fields are stripped)
