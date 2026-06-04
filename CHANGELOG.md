# Changelog

This changelog outlines all architectural, security, performance, and documentation modifications introduced during the LogiTrack codebase rescue.

---

## 🚀 Refactorings & Technical Modifications

### 1. Restructure into Model-View-Controller (MVC) Pattern
* **What was wrong**: The entire backend logic (routing, authentication, validation, queries, business logic, error mapping) was cramped inside a single file `src/routes.js` with no separation of concerns.
* **Refactoring done**: Split the flat codebase into modular MVC layers:
  * **Routes**: Mapping endpoints to controllers (`src/routes/auth.routes.js`, `src/routes/shipment.routes.js`, `src/routes/index.js`).
  * **Controllers**: Handling HTTP requests/responses (`src/controllers/auth.controller.js`, `src/controllers/shipment.controller.js`).
  * **Services**: Hosting all business rules and DB calls (`src/services/auth.service.js`, `src/services/shipment.service.js`).
  * **Models**: Retaining database schemas (`src/models/User.js`, `src/models/Shipment.js`).
  * **Middlewares**: Extracted auth check, validations, and global errors.
* **Improvement**: Clean, readable, and maintainable structure. New engineers can locate files and understand application structure in under a minute.

### 2. Replace Outdated Variable Syntax and Asynchronous Patterns
* **What was wrong**: Code was using `var` globally and nesting long promise chains using `.then().catch()` instead of modern JS syntax.
* **Refactoring done**: 
  * Replaced all instances of `var` with `const` (for constants and modules) or `let` (where variable values are reassigned).
  * Converted all `.then().catch()` promise chains into clean `async/await` blocks with proper exception propagation.
* **Improvement**: Prevents variable hoisting bugs, improves code legibility, and simplifies stack trace debugging.

### 3. Add Joi Validation Middleware
* **What was wrong**: Incoming payloads in `POST` and `PATCH` requests were directly saved into the database without sanitization or checks, exposing the app to NoSQL Parameter Injection and mass-assignment vulnerabilities.
* **Refactoring done**:
  * Created schemas in `src/validators/` for `register`, `login`, `createShipment`, and `updateStatus`.
  * Written a validation middleware creator in `src/middlewares/validation.middleware.js` to execute validations with `abortEarly: false` and `stripUnknown: true` options.
* **Improvement**: Ensures database integrity, strips out malicious/unknown inputs, and returns clear `422 Unprocessable Entity` validation messages to the API consumers.

### 4. Replace MD5 Hashing with Bcrypt
* **What was wrong**: Passwords were saved as raw MD5 hashes, which are insecure, cryptographically broken, and easily crackable in less than a second using rainbow tables.
* **Refactoring done**:
  * Installed `bcrypt` package.
  * Replaced MD5 hashing in user registration service with `bcrypt.hash(password, 12)`.
  * Replaced MD5 direct check in login service with secure `bcrypt.compare(password, hash)`.
* **Improvement**: Eliminates vulnerability to rainbow table or simple dictionary attacks, conforming to production-grade security standards.

### 5. Centralized Error Handling and Custom Error Classes
* **What was wrong**: Inconsistent error formatting, duplicate try/catch blocks logged in console and returned as HTTP 200 OK with `{ error: ... }` parameters, or crashed without returning JSON.
* **Refactoring done**:
  * Implemented an error handler middleware `src/middlewares/error.middleware.js` as the last Express handler.
  * Created custom error classes in `src/utils/errors.util.js` representing standard HTTP status codes (`NotFoundError`, `UnauthorizedError`, `ForbiddenError`, `ConflictError`, `ValidationError`, `BadRequestError`).
  * Replaced try/catch blocks in controllers with `next(err)` delegates.
* **Improvement**: Normalizes the response output format. Ensures consistent and correct HTTP status codes are returned for all error scenarios (e.g. 401 for bad auth, 403 for unauthorized action, 404 for missing resource, 409 for conflicts, 422 for validations, 500 for backend crashes).

### 6. Enforce Broken Access Control Checks
* **What was wrong**: A user could delete any shipment by ID (`DELETE /api/shipments/:id`) simply by providing a valid JWT, even if that shipment belonged to a different user.
* **Refactoring done**: Added check in `deleteShipment` and `updateShipmentStatus` to ensure the shipment creator ID matches `req.userId` or the user has an `admin` role.
* **Improvement**: Restores logical authorization boundaries, securing critical resources from parameter traversal attacks.

### 7. Resolve N+1 Database Query Performance Loop
* **What was wrong**: Querying all shipments (`GET /api/shipments`) executed a separate query to fetch user details for each returned shipment (`User.findById`) inside a CPU-blocking loop. This resulted in O(N+1) database operations.
* **Refactoring done**: Utilized Mongoose `.populate('userId', '-password')` to fetch the shipments and resolve their linked user details in a single combined database query.
* **Improvement**: Reduces database load and response latency significantly. DB query count drops from N+1 to 1, regardless of the quantity of shipments.

### 8. Add Comprehensive JSDoc Blocks
* **What was wrong**: Exported functions and classes had no description, types, param types, or throws documentation.
* **Refactoring done**: Documented all exports in services, controllers, middlewares, and utils using rich JSDoc syntax including `@param`, `@returns`, and `@throws` tags.
* **Improvement**: Enhances developer workspace autocomplete diagnostics and makes onboarding new developers smooth.
