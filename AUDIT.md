# Codebase Audit

## Summary
- Total smells found: 13
- Critical: 4 | High: 4 | Medium: 5

## Issues

| File | Issue | Severity |
|------|-------|----------|
| src/routes.js | MD5 used for password hashing | CRITICAL |
| src/routes.js | req.body passed directly to DB (Spread Operator) | CRITICAL |
| src/routes.js | N+1 Query Problem in shipment listing | CRITICAL |
| src/routes.js | No permission check on DELETE /shipments/:id | CRITICAL |
| src/routes.js | Unhandled Promise rejections / missing catch blocks | HIGH |
| src/routes.js | Missing Input Validation | HIGH |
| src/routes.js | God File - Mixing routing, business logic, DB queries | HIGH |
| src/app.js | var used throughout | MEDIUM |
| src/app.js | Unnecessary commented out / dead code | MEDIUM |
| src/routes.js | Magic strings (e.g. status 'pending') | MEDIUM |
| src/routes.js | Duplicate try/catch (or rather duplicate auth blocks) | HIGH |
| src/routes.js | No centralized error handling | MEDIUM |
| models/User.js| MD5 usage comment | MEDIUM |
