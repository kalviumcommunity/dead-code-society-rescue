# Changelog

All notable changes to the LogiTrack Backend project will be documented in this file.

## [1.1.0] - 2026-06-29

### Added
- Integrated `mongodb-memory-server` in the dev flow as a fallback database connection. If a local/remote MongoDB instance is not active on localhost or not configured, it automatically spins up an in-memory MongoDB server.
- Built a validation middleware utilizing `joi` for request body schema enforcement.
- Created validation schemas for registration, login, shipment creation, and shipment status update payloads.
- Added custom HTTP-aware Error classes (`AppError`, `NotFoundError`, `UnauthorizedError`, `ConflictError`, `ForbiddenError`, `BadRequestError`) for robust error separation.
- Wired a centralized error handling middleware to process operational and database errors.
- Created `auth.middleware.js` to extract, verify, and decode JWT authorization headers.

### Changed / Refactored
- Restructured the flat codebase layout into a clean, modern **MVC (Model-View-Controller)** pattern under `src/`:
  - `src/models/` for Mongoose models (`user.model.js`, `shipment.model.js`).
  - `src/services/` for business logic (`user.service.js`, `shipment.service.js`).
  - `src/controllers/` for HTTP requests/responses mapping (`user.controller.js`, `shipment.controller.js`).
  - `src/routes/` for mapping endpoints to controller handlers (`user.routes.js`, `shipment.routes.js`, `index.js`).
  - `src/middlewares/` for re-usable express logic.
  - `src/utils/` for shared utilities (e.g., custom error classes).
- Removed outdated `var` variable declarations across the codebase and replaced them with block-scoped `const` and `let`.
- Refactored callback and promise-chaining (`.then().catch()`) architectures into clean `async/await` structures.
- Replaced insecure MD5 hashing for registration password storage and login comparison with `bcrypt` (using 12 salt rounds).
- Unified individual inline authentication checks present on every shipment route into a centralized authentication middleware.
- Simplified controller methods by removing nested try/catch blocks and delegating error reporting to the centralized error handler using `next(err)`.
- Solved the **N+1 Database Query** performance bottleneck on `GET /api/shipments` by leveraging Mongoose's `.populate()` to load user details in a single query instead of executing a DB lookup inside a loop.
- Added rich JSDoc blocks to all exported functions in controllers, services, middlewares, and utilities specifying `@param`, `@returns`, and `@throws`.

### Fixed
- Fixed a **CRITICAL** authorization bypass vulnerability on `DELETE /api/shipments/:id` where any authenticated user could delete any shipment in the database regardless of ownership. The service now enforces ownership or admin privileges.
- Fixed an authorization bypass on `GET /api/shipments/:id` and `PATCH /api/shipments/:id/status` ensuring only owners or admins can retrieve or update the shipments.
- Fixed NoSQL Injection vulnerabilities in registration and login endpoints by validating input schemas with Joi and stripping unvalidated inputs.

---

## Detailed Rationale

| Action / Refactor | Reason (What was wrong) | Improvement (What is better now) |
|---|---|---|
| **MVC Layout Restructuring** | The codebase was completely flat with DB operations, auth checks, routes, and business logic combined in one massive, unmaintainable routes file. | Separation of concerns. Code is organized, maintainable, modular, and easy to scale. |
| **Replace MD5 with Bcrypt** | MD5 is cryptographically broken, extremely fast, and highly vulnerable to lookup/rainbow tables, exposing users' plaintext passwords to theft. | High-strength password hashing with salt, making password cracking computationally infeasible. |
| **Input Validation (Joi)** | Unvalidated inputs enabled NoSQL injection (e.g. inject query operators like `$ne`) and direct spread operators allowed client body payloads to overwrite protected fields like `role`. | Strict whitelist schema validation (422 status on fail), preventing injection attacks and parameter pollution. |
| **Centralized Error Middleware** | Try/catch blocks were duplicated across controllers, and errors frequently returned a HTTP 200 success status with generic messages instead of proper HTTP response codes. | Clean controllers free of boilerplates, uniform error response formats, and correct HTTP status codes (400, 401, 403, 404, 409, 500). |
| **N+1 Query Resolution** | The shipment list loop queried the User database once per shipment. With 100 shipments, this meant 101 database queries, causing severe database load. | Exactly 1 query executed using Mongoose `.populate()`, reducing latency and database utilization. |
| **Bypass Authorization Fix** | There was no check ensuring the authenticated user actually owned the shipment they deleted, allowing arbitrary data destruction. | Tight permissions enforcement where only shipment creators or admins can fetch, edit, or delete items. |
