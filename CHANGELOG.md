# CHANGELOG

## [Refactored] — 2024-01-15

### Security Fixes

- CRITICAL: Replaced MD5 with bcrypt (12 rounds) for password hashing
  Reason: MD5 is a general-purpose hash, not a password hashing algorithm.
  Rainbow tables can crack MD5-hashed passwords instantly.
  Improvement: Passwords are now computationally infeasible to crack even
  if the database is compromised.

- CRITICAL: Added Joi validation on all request bodies
  Reason: Raw req.body was being passed directly to Mongoose, enabling
  NoSQL injection attacks.
  Improvement: All inputs are validated and sanitised before any DB operation.

### Architecture Refactors

- Restructured flat file into MVC (routes, controllers, services, models)
  Reason: Single 600-line routes.js was handling routing, business logic,
  and DB queries simultaneously.
  Improvement: Each layer has one responsibility.

### Performance Fixes

- Fixed N+1 query in shipment listing — replaced loop with .populate()
  Reason: Fetching 100 shipments triggered 101 DB queries.
  Improvement: Now always 2 queries regardless of result count.

### Code Quality

- Replaced all var with const/let throughout codebase
- Rewrote all .then() chains as async/await
- Added centralized error handling middleware
- Added JSDoc on all exported service functions
