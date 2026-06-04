# CHANGELOG

## [Refactored] — 2026-06-04

### Security Fixes

- **CRITICAL: Replaced MD5 with bcrypt (12 rounds) for password hashing**
  - **Reason**: MD5 is a general-purpose hash, not a password hashing algorithm. Rainbow tables can crack MD5-hashed passwords instantly.
  - **Improvement**: Passwords are now computationally infeasible to crack even if the database is compromised.

- **CRITICAL: Added Joi validation on all request bodies**
  - **Reason**: Raw `req.body` was being passed directly to Mongoose, enabling NoSQL injection attacks and unintended field updates.
  - **Improvement**: All inputs are validated and sanitised against strict schemas before any DB operation.

- **CRITICAL: Fixed Unauthorized Deletion Vulnerability**
  - **Reason**: Any authenticated user could delete any shipment by ID.
  - **Improvement**: Added ownership checks to ensure only the owner or an admin can delete a shipment.

### Architecture Refactors

- **Restructured codebase into MVC (Routes, Controllers, Services, Models)**
  - **Reason**: Single 400+ line `routes.js` was handling routing, business logic, authentication, and DB queries simultaneously.
  - **Improvement**: Each layer has one responsibility, making the code maintainable and testable.

- **Extracted Authentication Middleware**
  - **Reason**: JWT verification logic was duplicated across every protected route.
  - **Improvement**: Centralized auth logic in a reusable middleware.

### Performance Fixes

- **Fixed N+1 query in shipment listing — replaced loop with `.populate()`**
  - **Reason**: Fetching 100 shipments triggered 101 DB queries because user details were fetched in a loop.
  - **Improvement**: Now always 2 queries regardless of result count.

### Code Quality

- **Modernized Syntax**: Replaced all `var` with `const`/`let` throughout the codebase.
- **Async/Await**: Rewrote all `.then()` chains and callbacks as `async/await` for better readability.
- **Centralized Error Handling**: Added custom error classes (`AppError`, `NotFoundError`, etc.) and a central middleware to eliminate duplicate `try/catch` and standardize error responses.
- **Documentation**: Added comprehensive JSDoc to all exported service and controller functions.
