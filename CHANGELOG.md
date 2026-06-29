<!-- ADDED: Changelog to track changes, reasons, and security/performance improvements. -->
# CHANGELOG

## [Refactored] — 2026-06-30

### Security Fixes

- **CRITICAL: Replaced MD5 with bcrypt (12 rounds) for password hashing**
  - *Reason*: MD5 is a cryptographic hash, not a password hashing algorithm, and can be cracked via rainbow tables in milliseconds.
  - *Improvement*: Passwords are now computationally infeasible to reverse or brute-force.
- **CRITICAL: Added Joi validation on all request bodies**
  - *Reason*: Direct database operations using unvalidated request bodies enabled NoSQL injection and parameter pollution.
  - *Improvement*: Input data is strictly typed, validated, and sanitized, with unrecognized attributes stripped via Joi.
- **CRITICAL: Added Authorization checks on delete and fetch shipments**
  - *Reason*: Any authenticated user could access or delete any shipment using just its ID.
  - *Improvement*: Users can now only fetch, update, or delete shipments they own, unless they hold an `admin` role.

### Architecture Refactors

- **Restructured into a modern MVC architecture**
  - *Reason*: A single monolithic `routes.js` file handled route definition, validation, database access, business rules, and error responses.
  - *Improvement*: Divided responsibility into dedicated folders: `routes/`, `controllers/`, `services/`, `models/`, `middlewares/`, `validators/`, and `utils/`.

### Performance Fixes

- **Resolved N+1 Query in shipment listings**
  - *Reason*: Retrieving user details inside a loop triggered separate database queries for every shipment.
  - *Improvement*: Replaced loops with Mongoose `.populate()`, reducing the queries to 2 database roundtrips regardless of the number of shipments.

### Code Quality & Standards

- **Replaced `var` with `const`/`let`**
  - *Reason*: `var` scope hoisting can cause silent runtime bugs.
  - *Improvement*: Modernized declarations block-scope code correctly.
- **Centralized error handling middleware**
  - *Reason*: Redundant `try/catch` blocks returned hardcoded 200 HTTP statuses for failed requests.
  - *Improvement*: Created standard error classes and registered a single global error handling middleware at the end of the Express middleware stack.
- **Added JSDoc documentation to service functions**
  - *Reason*: Lack of method definitions, parameter types, or return shapes made the code difficult to extend.
  - *Improvement*: Integrated JSDoc tags specifying parameters, return types, and possible thrown exceptions.
