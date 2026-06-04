# Changelog

## Refactor Summary

### 1. Tagged code smells and created an audit report
- What was wrong: The codebase had undocumented design and security issues scattered across the original flat files.
- Improvement: Added explicit smell tags and a root-level audit report so the issues were visible and trackable.

### 2. Reorganized the app into layered architecture
- What was wrong: Routing, business logic, database access, and response formatting lived in the same files.
- Improvement: Split the app into routes, controllers, services, middleware, and utils so each layer has one responsibility.

### 3. Replaced `var` and promise chains
- What was wrong: The code used `var` broadly and mixed `.then().catch()` chains with callback-style flow.
- Improvement: Converted the codebase to `const`/`let` and `async/await` for clearer scope and simpler control flow.

### 4. Added Joi validation middleware
- What was wrong: Request bodies were only checked with ad hoc field tests and could accept extra unexpected properties.
- Improvement: Added schema-based validation with Joi, 422 responses, and stripped unknown fields before controllers receive input.

### 5. Replaced MD5 with bcrypt
- What was wrong: Passwords were hashed and compared with MD5, which is too fast and weak for password storage.
- Improvement: Switched to bcrypt with 12 rounds for secure password hashing and comparison.

### 6. Extracted auth middleware
- What was wrong: Token verification had been handled inline and inconsistently across protected routes.
- Improvement: Moved JWT verification into dedicated middleware so protected routes share one auth boundary.

### 7. Centralized error handling
- What was wrong: Controllers had repeated `try/catch` blocks and inconsistent error status handling.
- Improvement: Added a shared error middleware and custom error classes so failures flow through one response path.

### 8. Fixed N+1 shipment lookup behavior
- What was wrong: Shipment listing previously queried users inside a loop, causing extra database round-trips.
- Improvement: Reworked shipment listing to use Mongoose population so query count stays flat as shipment count grows.

### 9. Added JSDoc to exported functions
- What was wrong: Exported functions in services, controllers, utils, and middleware lacked explicit documentation.
- Improvement: Added JSDoc blocks with parameters, return values, and thrown errors to make the code easier to maintain.

### 10. Updated project documentation
- What was wrong: The README reflected the old flat API shape and did not describe the refactored architecture.
- Improvement: Rewrote the README with current setup instructions, environment variables, API reference, and architecture diagram.
