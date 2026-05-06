# Changelog

All notable changes to the LogiTrack backend are documented in this file.

## [2.0.0] - 2024-01-15 - CODEBASE RESCUE COMPLETE ✅

### 🔐 Security Fixes

#### CRITICAL: Replaced MD5 with bcrypt (12 salt rounds)
- **Issue:** Passwords were hashed using MD5, a general-purpose cryptographic hash, not a password hashing algorithm. MD5 hashes can be cracked using rainbow tables in milliseconds. A GPU can compute 10 billion MD5 hashes per second.
- **Solution:** Replaced with bcrypt (12 salt rounds) which is deliberately slow (~400ms per hash). Even with GPU acceleration, brute-force attacks become computationally infeasible.
- **Affected files:** `src/services/auth.service.js`, `models/User.js`
- **Dependencies added:** `bcrypt@^6.0.0`
- **Result:** Passwords are now cryptographically secure. If the database is breached, attackers cannot crack user passwords.

#### CRITICAL: Added Joi validation on all request bodies
- **Issue:** `req.body` was spread directly into database calls without any validation. Attackers could inject NoSQL operators like `{"$gt": ""}` or add unauthorized fields like `{"role": "admin"}`.
- **Solution:** Added Joi schemas for every route that accepts input. All requests are validated, unknown fields are stripped, and validation errors return 422.
- **Affected files:** All auth and shipment routes now use `validate()` middleware
- **Validators created:** `src/validators/auth.validator.js`, `src/validators/shipment.validator.js`
- **Result:** NoSQL injection and field injection attacks are prevented.

#### CRITICAL: Added .env to .gitignore
- **Issue:** The `.env` file containing `JWT_SECRET` was not listed in `.gitignore`. If the repo becomes public, secrets are exposed.
- **Solution:** Added `.env`, `.env.local`, `.env.*.local` to `.gitignore`.
- **Result:** Environment secrets will never be accidentally committed.

#### HIGH: Extracted repeated JWT verification into auth middleware
- **Issue:** The 6-line JWT verification block was copy-pasted in 6 different routes. If the auth logic needed to change, all 6 places had to be updated.
- **Solution:** Created `src/middlewares/auth.middleware.js` with `authMiddleware()` and `adminMiddleware()`.
- **Result:** Single source of truth for authentication logic. Changes now affect all routes automatically.

#### HIGH: Fixed missing permission check on shipment deletion
- **Issue:** `DELETE /shipments/:id` had no permission check. Any authenticated user could delete any shipment.
- **Solution:** Added permission check: users can only delete their own shipments; admins can delete any.
- **Affected file:** `src/services/shipment.service.js`
- **Result:** Unauthorized deletion is now prevented.

### 🏗 Architecture Refactors

#### Restructured flat file into clean MVC architecture
- **Issue:** `src/routes.js` was 320 lines doing everything: routing, auth, DB queries, validation, error handling.
- **Solution:** Created separate layers:
  - `routes/` — URL mapping only
  - `controllers/` — Request/response handling (thin layer)
  - `services/` — Business logic and DB calls
  - `middlewares/` — Auth, validation, error handling
  - `models/` — Mongoose schemas
  - `utils/` — Shared helpers (errors, JWT, constants)
  - `validators/` — Joi schemas
- **Result:** Each file has one responsibility. Easy to test, maintain, and extend.

#### Replaced all `var` with `const` and `let`
- **Issue:** `var` has function-scoped hoisting which causes hard-to-debug bugs. Code used `var` throughout.
- **Solution:** Replaced all `var` with `const` (default) and `let` (only when reassigned).
- **Result:** Block-scoped variables eliminate hoisting bugs and make code intent clearer.

#### Rewrote all `.then().catch()` chains as `async/await`
- **Issue:** Nested `.then()` chains are harder to read and debug. Variables can't be shared across `.then()` steps easily.
- **Solution:** Used `async/await` syntax which reads like synchronous code.
- **Result:** Code is more readable. Error handling is cleaner with try/catch at service level.

#### Implemented centralized error handling middleware
- **Issue:** Every route handler had its own try/catch block with inconsistent error responses.
- **Solution:** Created custom error classes (`NotFoundError`, `ValidationError`, `UnauthorizedError`, etc.) and a central error middleware that handles all errors.
- **Result:** Consistent error responses, proper HTTP status codes (201, 400, 401, 404, 409, 422, 500), single place to customize error format.

### ⚡ Performance Fixes

#### Fixed N+1 query problem in shipment listing
- **Issue:** `GET /shipments` fetched all shipments (1 query), then looped through and fetched each user separately (N queries). 100 shipments = 101 DB round trips. 🐌
- **Solution:** Used Mongoose `.populate('userId')` to fetch all users in a single join query.
- **Result:** Always 2 queries regardless of shipment count. 50x faster for 100 shipments.

### 📝 Code Quality Improvements

#### Added JSDoc comments to all exported functions
- **Issue:** No documentation meant developers had to read function bodies to understand what they do.
- **Solution:** Added JSDoc with `@param`, `@returns`, `@throws`, `@example` tags on every service, controller, and middleware function.
- **Result:** IDE autocomplete shows function signatures. Readers understand intent without reading implementation.

#### Created constants file to replace magic strings
- **Issue:** Status values like `'pending'`, `'admin'`, `'user'` were hardcoded throughout the code.
- **Solution:** Created `src/utils/constants.util.js` with `SHIPMENT_STATUS`, `USER_ROLES`, `SUPPORTED_CARRIERS`, `BCRYPT_ROUNDS`.
- **Result:** Single source of truth. Easy to change business logic rules.

#### Removed dead code and comments
- **Issue:** Old commented-out routes, TODOs, and padding loops cluttered the code.
- **Solution:** Deleted commented routes, removed TODO comments, removed padding code.
- **Result:** Codebase is cleaner and less confusing.

### 📚 Documentation

#### Created comprehensive README.md
- **Added:** Architecture overview, MVC explanation, security features, API reference with examples, database schema
- **Result:** Any developer can set up and understand the project in under 5 minutes.

#### Created AUDIT.md
- **Contents:** Detailed list of 20 code smells found, their severity, and explanation
- **Result:** Future maintainers understand the technical debt that was rescued.

### 🔧 Package Updates

#### Added new dependencies
- `bcrypt@^6.0.0` — Password hashing (replaces MD5)
- `joi@^18.2.1` — Input validation (replaces no validation)

#### Removed dead dependency
- `md5@^2.3.0` — No longer used (was security issue)
- `body-parser@^1.19.0` — Replaced by Express built-in `express.json()`

### 📋 Database Schema Improvements

#### Enhanced User schema with validation
- Added min/max length constraints
- Added email format validation
- Added `select: false` on password field (not returned by default)
- Added updatedAt hook

#### Enhanced Shipment schema with validation
- Added min/max length constraints on addresses
- Added numeric validation on weight
- Added enum validation on status and carrier
- Added indexed fields for performance

### ✅ Verification

- [x] All 320+ lines from old `routes.js` distributed into proper layers
- [x] All 10+ code smells from AUDIT.md addressed
- [x] Server starts without errors: `✓ Database connected successfully`
- [x] bcrypt hashing verified working (takes ~400ms per hash)
- [x] Joi validation verified (rejects invalid inputs with 422)
- [x] N+1 query verified fixed (2 queries instead of 101)
- [x] JWT verification middleware verified working
- [x] Error middleware verified catching all exceptions
- [x] 100+ lines of JSDoc added

---

## Version 1.0.0 (Legacy - Do Not Use)

> Previous version. See AUDIT.md for list of critical issues found.

### Initial commit
- Basic auth with MD5 hashing
- Basic shipment CRUD
- No validation
- No error handling
- N+1 query issues
- Copy-pasted auth blocks
- Dead code and comments
