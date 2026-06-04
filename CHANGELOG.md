# CHANGELOG

## 2026-06-04 - Codebase Rescue

### Security

- Replaced MD5 password hashing with bcrypt at 12 rounds.
  - Reason: MD5 is fast and crackable.
  - Improvement: Password hashes are now significantly harder to brute force.

- Added Joi validation for auth and shipment write routes.
  - Reason: Raw `req.body` data was reaching the database layer.
  - Improvement: Inputs are validated and sanitized before any persistence logic runs.

- Centralized JWT verification in middleware.
  - Reason: Auth checks were duplicated inline across routes.
  - Improvement: Protected routes now use one consistent verification path.

### Architecture

- Split the flat route file into routes, controllers, services, models, middlewares, and utils.
  - Reason: The previous file mixed request handling, business logic, and database calls.
  - Improvement: Each layer now has one responsibility and is easier to test.

- Added a centralized Express error handler.
  - Reason: Errors were handled inconsistently with ad hoc response logic.
  - Improvement: Failures now return predictable HTTP responses from one place.

### Performance

- Removed the shipment listing N+1 pattern by using Mongoose `populate`.
  - Reason: The old implementation queried the database inside a loop.
  - Improvement: Shipment listing now resolves related user data without per-item lookups.

### Documentation

- Rewrote the README with setup steps, environment variables, architecture, and API reference.
  - Reason: The project did not provide enough information for a cold start.
  - Improvement: A new developer can bootstrap the API without asking for help.

- Added JSDoc to exported functions in the new backend layers.
  - Reason: The codebase had no inline contract documentation.
  - Improvement: Function intent, inputs, outputs, and thrown errors are now explicit.