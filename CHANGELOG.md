# CHANGELOG

## [Refactored] — 2026-06-04

### Security Fixes

- CRITICAL: Replaced MD5 with bcrypt (12 rounds) for password hashing
  Reason: MD5 is a general-purpose hash, not a password hashing algorithm.
  Rainbow tables can crack MD5-hashed passwords instantly.
  Improvement: Passwords are now computationally infeasible to crack even
  if the database is compromised.

- CRITICAL: Added Joi validation on all request bodies
  Reason: Raw `req.body` was being passed directly to Mongoose, enabling
  NoSQL injection attacks.
  Improvement: All inputs are validated and sanitised before any DB operation.

- HIGH: Centralized JWT verification
  Reason: JWT verification was manually replicated across every protected route.
  Improvement: Extracted to `auth.middleware.js` to ensure consistent and unified protection.

- HIGH: Added Authorization Check to deleteShipment
  Reason: `deleteShipment` was allowing any logged-in user to delete any shipment, regardless of ownership.
  Improvement: Implemented ownership checks to ensure users can only modify their own data unless they are admins.

### Architecture Refactors

- Restructured flat file into MVC (routes, controllers, services, models)
  Reason: Single 600-line `routes.js` was handling routing, business logic,
  and DB queries simultaneously.
  Improvement: Each layer has one responsibility.

### Performance Fixes

- Fixed N+1 query in shipment listing — replaced loop with `.populate('userId')`
  Reason: Fetching 100 shipments triggered 101 DB queries.
  Improvement: Now always 2 queries regardless of result count.

### Code Quality

- Replaced all `var` with `const`/`let` throughout codebase
  Reason: Prevent hoisting bugs.
- Rewrote all `.then()` chains as `async/await`
  Reason: Eliminate callback hell and improve readability.
- Added centralized error handling middleware
  Reason: Prevented duplicate try/catch code across the entire codebase.
- Added JSDoc on exported functions
  Reason: Improve self-documenting structure for IDE autocompletion.
