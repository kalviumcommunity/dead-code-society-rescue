# Changelog

## 2026-05-12

### Audit and smell tagging

- Added `// SMELL:` annotations to the legacy codebase before refactoring.
- Reason: the original flat router mixed auth, hashing, persistence, and response handling in one file.
- Improvement: the risky patterns were documented before they were removed or replaced.

### MVC restructure

- Moved routing, controllers, services, models, middlewares, and utils into separate `src/` folders.
- Reason: the app was a monolith with no clear separation of responsibilities.
- Improvement: the HTTP layer is now thin, business logic is reusable, and database logic is isolated.

### Validation layer

- Added Joi schemas and a validation middleware for every body-bearing route.
- Reason: request bodies were accepted directly and could overpost unexpected fields.
- Improvement: invalid requests now fail with 422 and sanitized payloads are passed downstream.

### Security hardening

- Replaced MD5 password handling with bcrypt and centralized JWT verification in middleware.
- Reason: MD5 is not suitable for passwords, and auth logic was duplicated inline.
- Improvement: passwords are hashed with bcrypt, tokens are checked in one place, and protected routes are consistent.

### Centralized error handling

- Added custom error classes and a single error middleware.
- Reason: controllers and routes previously returned inconsistent JSON errors.
- Improvement: status codes now come from the error type and failures are handled uniformly.

### N+1 query fix

- Replaced the shipment/user lookup loop with Mongoose `populate()` and access-controlled queries.
- Reason: the old implementation issued one user query per shipment.
- Improvement: shipment listing now avoids the N+1 pattern and is easier to scale.

### Async cleanup

- Replaced legacy promise chains in the app bootstrap with async/await.
- Reason: the startup path used `.then().catch()` instead of a direct async flow.
- Improvement: startup code is easier to read and aligns with the rest of the codebase.

### Documentation refresh

- Rewrote `README.md` and added this changelog.
- Reason: the previous documentation described the old flat implementation.
- Improvement: the repository now documents the new architecture, environment variables, and API surface.
