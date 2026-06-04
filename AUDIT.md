# Codebase Audit

## Summary
- Total smells found: 13
- Critical: 4 | High: 4 | Medium: 5

## Issues

| File | Issue | Severity | Explanation |
|------|-------|----------|-------------|
| src/routes.js | No input validation on register | CRITICAL | Spread operator enables NoSQL injection as any fields can be passed. |
| src/routes.js | MD5 password hashing | CRITICAL | Not a password algorithm; instantly crackable with rainbow tables. |
| src/routes.js | No input validation on login | CRITICAL | Direct object passing enables NoSQL injection on email field. |
| src/routes.js | MD5 validation on login | CRITICAL | Password comparison is insecure due to MD5 usage. |
| src/routes.js | N+1 Query Problem | HIGH | Querying DB inside a loop causes N+1 network calls instead of a single join. |
| src/routes.js | Missing .catch() inside loop | HIGH | Silent failure risk during DB query execution. |
| src/routes.js | Missing .catch() in promise chain | HIGH | Unhandled promise rejection on profile lookup. |
| src/routes.js | Missing authorization check | HIGH | Any logged-in user can delete any shipment without ownership verification. |
| src/routes.js | Magic string 'pending' | MEDIUM | Used without constants, leading to potential typos. |
| src/routes.js | Magic string 'delivered' | MEDIUM | Status checks use hardcoded strings instead of enum/constants. |
| src/routes.js | Duplicate auth logic | MEDIUM | Token extraction and JWT verification duplicated across multiple routes. |
| src/routes.js | var used everywhere | MEDIUM | Causes function-scoped hoisting bugs; should use const/let. |
| src/app.js | var used everywhere | MEDIUM | Same issue with var hoisting as routes.js. |
