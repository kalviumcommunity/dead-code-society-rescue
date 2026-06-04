# CHANGELOG

## [Refactored] — 2024-06-04

### Security Fixes

- **CRITICAL**: Replaced MD5 with bcrypt (12 rounds) for password hashing
  - Reason: MD5 is a general-purpose hash, not a password hashing algorithm. Rainbow tables can crack MD5-hashed passwords instantly.
  - Improvement: Passwords are now computationally infeasible to crack even if the database is compromised.

- **CRITICAL**: Added Joi validation on all request bodies
  - Reason: Raw req.body was being passed directly to Mongoose, enabling NoSQL injection attacks.
  - Improvement: All inputs are validated and sanitised before any DB operation with stripUnknown: true.

- **CRITICAL**: Added .env to .gitignore
  - Reason: .env was not in .gitignore, which would expose secrets (DATABASE_URL, JWT_SECRET) if the repo was public.
  - Improvement: Environment variables are now properly excluded from version control.

- **HIGH**: Extracted JWT verification into auth middleware
  - Reason: JWT verification code was duplicated 4+ times inline in routes.
  - Improvement: Single authenticate middleware ensures consistent auth checking across all protected routes.

- **HIGH**: Added authorization check on shipment deletion
  - Reason: Any authenticated user could delete any shipment regardless of ownership.
  - Improvement: Users can only delete their own shipments (unless they are admin).

### Architecture Refactors

- Restructured flat file into MVC (routes, controllers, services, models)
  - Reason: Single 328-line routes.js was handling routing, business logic, and DB queries simultaneously.
  - Improvement: Each layer has one responsibility - routes wire URLs to controllers, controllers call services, services handle business logic, models define schemas.

- Separated concerns into proper folder structure
  - Created src/routes/, src/controllers/, src/services/, src/models/, src/middlewares/, src/validators/, src/utils/
  - Reason: Everything was mixed together with no separation of concerns.
  - Improvement: Clear separation makes the codebase maintainable and testable.

### Performance Fixes

- Fixed N+1 query in shipment listing — replaced loop with .populate()
  - Reason: Fetching 100 shipments triggered 101 DB queries (1 for shipments + N for user details in loop).
  - Improvement: Now always 2 queries regardless of result count using Mongoose populate.

- Removed unused imports
  - Reason: path, fs, http, os were imported but never used in routes.js.
  - Improvement: Cleaner code with no dead dependencies.

### Code Quality

- Replaced all var with const/let throughout codebase
  - Reason: var causes function-scoped hoisting bugs that are notoriously hard to debug.
  - Improvement: Block-scoped const/let prevents hoisting issues and makes code more predictable.

- Rewrote all .then() chains as async/await
  - Reason: Nested promise chains with missing error handlers caused silent failures.
  - Improvement: async/await provides better readability and proper error propagation.

- Added centralized error handling middleware
  - Reason: Duplicate try/catch blocks in every route handler would require updating 20+ files if error format changed.
  - Improvement: Single error handler middleware handles all errors consistently with proper HTTP status codes.

- Removed dead code
  - Reason: Commented-out functions and useless padding loops added noise.
  - Improvement: Cleaner codebase with no distractions for future readers.

- Replaced magic strings with enums in schemas
  - Reason: Status values like 'pending', 'delivered' were hardcoded strings.
  - Improvement: Mongoose enum validation ensures only valid values are accepted.

- Added JSDoc on all exported service functions
  - Reason: No documentation made it difficult to understand function contracts.
  - Improvement: Every exported function now has @param, @returns, and @throws tags for IDE autocomplete.

- Removed deprecated Mongoose options
  - Reason: useCreateIndex and useFindAndModify are deprecated in newer Mongoose versions.
  - Improvement: Code is future-proofed for Mongoose updates.

- Added 404 handler middleware
  - Reason: Express default 404 sends HTML, not JSON.
  - Improvement: API returns consistent JSON responses for all error cases.

- Removed body-parser dependency
  - Reason: Express 4.16+ has built-in body parsing.
  - Improvement: Reduced dependency count by using Express built-in functionality.

### Documentation

- Wrote comprehensive README.md with:
  - Tech stack table
  - Quick start guide
  - Environment variables documentation
  - Complete API reference
  - Architecture diagram
  - Folder structure
  - Security features overview
  - Example usage with curl commands

- Created AUDIT.md documenting all 22 code smells found
  - Critical: 7 | High: 8 | Medium: 7
  - Each smell includes file, severity, and explanation

- Created this CHANGELOG.md documenting all changes
  - Reason for each change
  - Improvement produced by each change

### Dependencies Updated

- Added: bcrypt@^6.0.0 (password hashing)
- Added: joi@^18.2.1 (input validation)
- Removed: md5@^2.3.0 (insecure password hashing)
- Removed: body-parser@^1.19.0 (redundant with Express built-in)
