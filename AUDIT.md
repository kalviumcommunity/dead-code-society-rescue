# Codebase Audit

## Summary
- Total smells found: 12
- Critical: 5 | High: 4 | Medium: 3

## Issues

| File | Issue | Severity | Explanation |
|------|-------|----------|-------------|
| src/app.js | `var` in bootstrap | HIGH | Function-scoped `var` makes the startup path harder to reason about and encourages accidental reuse. |
| src/app.js | Unused `path` import | MEDIUM | Dead imports add noise and suggest the bootstrap file is carrying legacy code. |
| src/app.js | Models imported in app layer | HIGH | The application bootstrap should not know about persistence models directly. |
| src/app.js | DB connect failure only logs | MEDIUM | The process can continue in a broken state without a clear startup failure. |
| src/routes.js | MD5 password hashing | CRITICAL | MD5 is unsuitable for passwords and can be cracked very quickly. |
| src/routes.js | Raw request body spread into user creation | CRITICAL | Copying arbitrary request fields into persistence logic invites NoSQL injection and schema abuse. |
| src/routes.js | MD5 password comparison on login | CRITICAL | Credential checks rely on a weak hash instead of a slow password verifier. |
| src/routes.js | Registration error swallowed | MEDIUM | The route hides validation and persistence failures behind a generic response. |
| src/routes.js | Login error swallowed | MEDIUM | The route hides operational failures and returns no actionable status semantics. |
| src/routes.js | N+1 shipment lookup | HIGH | The route queries user data once per shipment, which scales poorly. |
| src/routes.js | Delete without ownership checks | CRITICAL | Any authenticated user can delete any shipment record. |
| src/routes.js | Missing catch in profile route | HIGH | The profile lookup can reject without centralized error handling. |