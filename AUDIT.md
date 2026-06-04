# Codebase Audit
 
## Summary
- Total smells found: 13
- Critical: 4 | High: 4 | Medium: 5
 
## Issues
 
| File | Issue | Severity | Explanation |
|------|-------|----------|-------------|
| src/routes.js | MD5 password hashing | CRITICAL | Not a password algorithm; instantly crackable via rainbow tables. |
| src/routes.js | No input validation | CRITICAL | req.body passed directly to DB allows NoSQL injection and malicious field overrides. |
| src/routes.js | Missing authentication check | CRITICAL | DELETE /shipments/:id allows any logged-in user to delete any resource regardless of ownership. |
| src/routes.js | Duplicated Auth logic | HIGH | JWT verification is repeated in every protected route instead of using a shared middleware. |
| src/routes.js | N+1 Query Problem | HIGH | Database queries inside loops for shipment listings cause extreme performance degradation. |
| src/routes.js | callback/Promise Hell | HIGH | Deeply nested .then() chains make the code hard to read and maintain. |
| src/routes.js | Missing error handling | HIGH | Some promise chains lack .catch() blocks, leading to unhandled rejections and crashes. |
| src/routes.js | var used throughout | MEDIUM | Function-scoped 'var' can lead to hoisting bugs. Use 'const' or 'let'. |
| src/routes.js | Unused Imports | MEDIUM | Imports like 'path', 'fs', 'http' are declared but never used. |
| src/routes.js | Hardcoded Secrets | MEDIUM | JWT_SECRET has a hardcoded default, posing a security risk if .env is missing. |
| src/routes.js | Magic Strings | MEDIUM | Statuses like 'delivered' and 'pending' are hardcoded strings instead of being centralized. |
| src/routes.js | Incorrect Status Codes | MEDIUM | Using 200 for resource creation instead of 201. |
| src/routes.js | Dead Code | MEDIUM | Large blocks of commented code and dummy loops used solely to inflate file size. |
