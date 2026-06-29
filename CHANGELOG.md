# Changelog

All notable architectural, security, and performance changes to the LogiTrack backend codebase are documented in this file.

---

## [1.0.0] - codebase-rescue

### 1. Codebase Audit & Tagging
- **Refactor:** Conducted a comprehensive line-by-line codebase audit of the legacy `src/routes.js` and tagged 12 code smells.
- **Reason:** Legacy code lacked comments, structure, and had multiple critical security vulnerabilities.
- **Improvement:** Produced `AUDIT.md` mapping out issue severity, descriptions, and file locations for high visibility.

### 2. MVC Architectural Restructure
- **Refactor:** Migrated the flat `src/routes.js` into separated layers: `routes/`, `controllers/`, `services/`, `middlewares/`, and `utils/`. Moved the `models/` directory inside `src/`.
- **Reason:** Routing, database calls, authorization, and output formatting were completely tangled in a single file, violating the Single Responsibility Principle.
- **Improvement:** Dramatically improved code maintainability and readability. New developers can locate files instantly.

### 3. Eliminated `var` and Callback Chains
- **Refactor:** Replaced all `var` statements with `const` or `let`. Rewrote all `.then().catch()` promise chains with clean `async/await` syntax.
- **Reason:** Legacy `var` declarations are function-scoped and prone to hoisting issues. Complex callback chains created "promise callback hell."
- **Improvement:** Modernized Javascript syntax, resolved scope leakage, and made asynchronous code sequential and easy to read.

### 4. Added Request Body Validation using Joi
- **Refactor:** Integrated the `Joi` validation library and configured schemas in `src/validators/` for auth and shipment endpoints. Integrated a centralized `validateBody` middleware.
- **Reason:** The legacy code spread unvalidated payloads directly (`...req.body`), allowing arbitrary database injection and mass assignment vulnerabilities.
- **Improvement:** Automatically rejects bad payloads with `422 Unprocessable Entity` containing clear error detail messages. Request bodies are safely sanitized (stripped of unknown parameters).

### 5. Upgraded Hashing to `bcrypt` & Centralized JWT
- **Refactor:** Replaced the insecure `md5` hashing with `bcrypt` (12 rounds) for registration and login password checks. Extracted token checking into a reusable `auth.middleware.js`.
- **Reason:** MD5 is cryptographically broken and prone to instant rainbow table attacks. Authentication logic was copied and pasted into almost every route.
- **Improvement:** Secure password storage. Authorization middleware is placed only on routes that require it, reducing duplicate code.

### 6. Centralized Error Handling Middleware
- **Refactor:** Implemented custom error utility classes (`NotFoundError`, `UnauthorizedError`, etc.) and a centralized error handling middleware as the last application route handler. Removed duplicate try/catch blocks from controllers.
- **Reason:** The server had scattered error handling, occasionally returning `200 OK` on errors or ignoring query failures, which could cause silent database failures or unhandled rejections.
- **Improvement:** Standardized API error responses. Eliminated controller boilerplate try/catch code by passing failures to `next(err)`.

### 7. Fixed N+1 Query Inefficiency
- **Refactor:** Replaced the database call inside a loop in `/api/shipments` with Mongoose's `.populate('userId')`.
- **Reason:** Legacy code fetched User details sequentially for every single shipment in a loop, resulting in $N+1$ database queries and severe performance degradation.
- **Improvement:** Optimized database traffic to a single fetch execution, reducing latency and query count from $O(N)$ to $O(1)$.

### 8. Added JSDoc Comments
- **Refactor:** Wrote comprehensive JSDoc comments for all exported modules.
- **Reason:** There was zero documentation on function arguments, return types, or possible exceptions.
- **Improvement:** Enabled IDE autocomplete and clear documentation for the next developer.
