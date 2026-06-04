# LogiTrack Backend Audit

Date: 2026-06-04

## Scope
- Application code under src/
- Models under models/
- Package dependencies and runtime configuration

## Findings

### CRITICAL
- Hardcoded JWT secret fallback and weak secret handling allows token forgery if env is misconfigured. The previous default of "secret123" enabled trivial JWT compromise.
- MD5 password hashing is cryptographically broken and enables credential cracking at scale.
- Authorization bypass on shipment deletion let any authenticated user delete any shipment.

### HIGH
- NoSQL injection risk from spreading unsanitized request bodies directly into model creation.
- N+1 query pattern in shipments listing causes unbounded database load and timing leakage.
- Missing input validation enables malformed payloads and error amplification.

### MEDIUM
- Repeated auth logic per route increased drift risk and inconsistent handling.
- Missing centralized error handling led to inconsistent error shapes and silent failures.
- Lack of consistent status codes (200 for all responses) complicates client error handling.

### LOW
- Unused imports and dead code blocks increase maintenance cost.
- Excessive inline comments and padding reduce signal-to-noise.

## Recommendations Implemented
- Replaced MD5 with bcrypt and added configurable salt rounds.
- Added Joi validation for request bodies and params.
- Introduced centralized error handling and consistent error payloads.
- Refactored to MVC structure with controllers, routes, middlewares, and models.
- Fixed N+1 queries using Mongoose population.
- Enforced authorization checks on destructive operations.

## Residual Risk
- JWT secret remains environment-dependent; rotate secrets and enforce strong values in deployment.
- Rate limiting and audit logging are still recommended for production readiness.
