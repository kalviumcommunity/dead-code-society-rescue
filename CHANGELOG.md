# Changelog

## Codebase Rescue Enhancements

### 1. MVC Restructuring
- **Reason:** The entire application logic (routing, DB queries, auth) was housed in a single `routes.js` flat file. It was hard to navigate, untestable, and broke separation of concerns.
- **Improvement:** Extracted code into `src/routes/`, `src/controllers/`, `src/services/`, and `src/models/`. Now, the business logic is decoupled from routing, significantly increasing maintainability.

### 2. Async/Await Refactoring & `let`/`const`
- **Reason:** The codebase was cluttered with callback-style `.then().catch()` chains, leading to promise hell and poor readability. Variables were declared with `var`, leading to potential scope leakage and hoisting bugs.
- **Improvement:** Promisified logic using modern `async/await` and replaced `var` with block-scoped `const` and `let`. Error control flow is much simpler.

### 3. Joi Validation Middleware
- **Reason:** `req.body` was passed directly to Mongoose queries (e.g. `User.findOne(req.body)`) and inserts, leaving the app wide open to NoSQL injection and mass assignment.
- **Improvement:** Implemented Joi validation schemas and a centralized middleware. `req.body` is now strictly validated and stripped of unknown fields before reaching controllers.

### 4. Replaced MD5 with bcrypt
- **Reason:** The system used `md5` for password hashing, which is not a secure algorithm and can be instantly cracked via rainbow tables.
- **Improvement:** Migrated to `bcrypt` with a work factor of 12 for secure password hashing and comparison, dramatically increasing resilience against dictionary and brute-force attacks.

### 5. Centralized Error Handling
- **Reason:** Error handling was inconsistent; inline `try/catch` and `.catch()` blocks manually sent `res.json({ error: ... })`, sometimes omitting status codes or omitting `catch` entirely.
- **Improvement:** Created custom `AppError` subclasses (`NotFoundError`, `UnauthorizedError`) and a global error handling middleware. Wrapped all routes with `asyncWrapper` to automatically catch thrown errors and pass them to the global handler.

### 6. Fixed N+1 Queries
- **Reason:** `GET /shipments` retrieved all shipments for a user, then mapped over them, initiating a separate database query for each shipment to attach user details.
- **Improvement:** Replaced the internal loop with Mongoose's `.populate('userId')` which solves the N+1 issue, improving endpoint performance drastically.

### 7. Extracted JWT Auth Middleware
- **Reason:** The JWT token validation logic was manually copied and pasted in every protected route, leading to massive code duplication and maintenance hazard.
- **Improvement:** Placed the JWT validation in a standalone `auth.middleware.js` and wired it into the Express routers, shrinking the controller sizes and ensuring DRY principles.

### 8. Added JSDoc Comments
- **Reason:** Functions lacked documentation, making it difficult for the next engineer to understand their parameters, return types, or possible exceptions.
- **Improvement:** Exported functions across services, controllers, middlewares, and utils are now documented with robust JSDoc blocks.
