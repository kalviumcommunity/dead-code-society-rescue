# Codebase Audit

## Summary
- Total smells found: 10
- Critical: 4 | High: 2 | Medium: 4

## Issues

| File | Issue | Severity | Explanation |
|------|-------|----------|-------------|
| src/routes.js | Unsafe Spread for Body | HIGH | Spread operator on req.body enables NoSQL injection. |
| src/routes.js | MD5 password hashing | CRITICAL | Not a password algorithm; instantly crackable. |
| src/routes.js | Promise without try/catch | MEDIUM | Using .then() instead of async/await style. |
| src/routes.js | MD5 password checking | CRITICAL | Checking plaintext against MD5 hash is insecure. |
| src/routes.js | Inline Auth Middleware | MEDIUM | Authentication verification logic is duplicated across all routes. |
| src/routes.js | N+1 Query in loop | HIGH | Fetching user details per shipment in a loop introduces massive N+1 overhead. |
| src/routes.js | Missing Delete Auth Check| CRITICAL | Any authenticated user can delete any shipment without authorization. |
| src/routes.js | Unhandled Promise Catch | CRITICAL | findById lacks .catch(), leading to unhandled promise rejections on failure. |
| src/routes.js | Missing Input Validation| MEDIUM | Object inputs are passed directly to database creations and updates. |
| src/routes.js | Hardcoded constants | MEDIUM | Hardcoding magic strings like 'pending' and 'delivered' is error-prone. |