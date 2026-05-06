# CHANGELOG

## [Refactored] - 2026-05-06

### Security Fixes

- Replaced MD5 password hashing with bcrypt (12 rounds) in authentication flow.
  Reason: MD5 is not a password hashing algorithm and is crackable quickly.
  Improvement: Password hashes are salted and computationally expensive to brute-force.

- Added Joi validation middleware for all body-driven routes.
  Reason: Raw request bodies were being passed directly into database operations.
  Improvement: Inputs are validated, sanitized, and unknown fields are stripped.

- Added centralized JWT authentication middleware.
  Reason: Token verification logic was duplicated in multiple endpoints.
  Improvement: Consistent authentication handling and cleaner route code.

- Added authorization checks for shipment delete/update ownership and admin constraints.
  Reason: Any authenticated user could previously delete shipments.
  Improvement: Access control now enforces owner-or-admin permissions.

### Architecture Refactors

- Migrated from a single flat route file into MVC-style structure:
  - `src/routes`
  - `src/controllers`
  - `src/services`
  - `src/models`
  - `src/middlewares`
  - `src/utils`
  - `src/validators`

  Reason: The old god file mixed routing, business logic, DB access, auth, and error responses.
  Improvement: Clear separation of concerns and easier maintainability.

- Split app setup from boot logic using `src/server.js` and `src/app.js`.
  Reason: Startup and app composition were tightly coupled.
  Improvement: Cleaner startup flow and easier testing.

### Performance Fixes

- Fixed shipment listing N+1 query by replacing per-shipment `User.findById` calls with `populate`.
  Reason: Old flow executed one additional DB query per shipment.
  Improvement: Consistent query count and better scalability.

### Error Handling

- Added custom error classes and centralized error middleware.
  Reason: Route handlers returned inconsistent error payloads and status codes.
  Improvement: Uniform error format and easier debugging.

### Code Quality

- Replaced legacy `var` patterns with `const`/`let` in new architecture.
- Rewrote promise-chain style code using `async/await` for readability.
- Removed dead code files and obsolete monolithic router.
- Added JSDoc blocks for exported functions in controllers, services, middlewares, and utilities.

### Documentation

- Rewrote `README.md` with setup, env variables, architecture, and endpoint reference.
- Added `.env.example` template for onboarding.
- Added `AUDIT.md` summarizing identified code smells and severities.
