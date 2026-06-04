# Codebase Audit

## Summary
- Total smells found: 15
- Critical: 4 | High: 7 | Medium: 4

## Issues

| File | Issue | Severity | Explanation |
|------|-------|----------|-------------|
| src/routes.js | MD5 password hashing on registration | CRITICAL | MD5 is not a cryptographic hash for passwords; rainbow tables can crack it in under a second. Use bcrypt with 12 rounds. |
| src/routes.js | MD5 password comparison on login | CRITICAL | Comparing plaintext MD5 is insecure. Use bcrypt.compare() for verification. |
| src/routes.js | NoSQL injection via spread operator in /register | CRITICAL | Spreading req.body directly bypasses Mongoose schema validation and allows attacker to inject any fields (including admin flags). |
| src/routes.js | NoSQL injection via unsanitized email in /login | CRITICAL | Accepting req.body.email without validation allows MongoDB operator injection (e.g., $ne, $regex). |
| src/routes.js | No permission check on DELETE /shipments/:id | CRITICAL | Any authenticated user can delete any shipment. Should verify user ownership or admin role. |
| src/routes.js | Auth block duplicated in every route | HIGH | 7 routes repeat the same JWT verification logic. Extract into reusable auth middleware. |
| src/routes.js | N+1 query problem in GET /shipments | HIGH | For each of N shipments, code queries DB to fetch user details. Should use .populate('userId') for single query. |
| src/routes.js | No input validation on any route | HIGH | Routes accept req.body without schema validation. Email format, password strength, shipment fields not validated. |
| src/routes.js | Inconsistent HTTP status codes | HIGH | All endpoints return 200 (OK) regardless of outcome. Should use 201 (Created), 400 (Bad Request), 401 (Unauthorized), 404 (Not Found), 422 (Unprocessable Entity). |
| src/routes.js | No centralized error handling | HIGH | Each route has its own try/catch blocks with inline error responses. Missing global error middleware. |
| src/routes.js | Silent failures in N+1 loop | HIGH | User.findById() in the shipment loop has no error handler; failures silently block completion. |
| src/routes.js | Using var instead of const/let | MEDIUM | var is function-scoped and can cause unexpected behavior. Replace all with const (preferred) or let. |
| src/routes.js | Unused imports (path, fs, http, os) | MEDIUM | Imports are never used; remove to reduce bundle size and improve clarity. |
| src/routes.js | Hardcoded JWT secret with fallback | MEDIUM | 'secret123' is a weak default; should require JWT_SECRET env var or throw error if missing. |
| src/routes.js | Promise .then().catch() chains instead of async/await | MEDIUM | Nested callbacks are hard to read and maintain. Convert to async/await for linear flow. |
| src/routes.js | Magic strings for shipment status | MEDIUM | Status values ('pending', 'in-progress', 'delivered', 'cancelled') hardcoded throughout. Use constants. |
| models/User.js | Using var instead of const/let | MEDIUM | var is function-scoped. Use const for all non-reassigned variables. |
| models/Shipment.js | Using var instead of const/let | MEDIUM | var is function-scoped. Use const for all non-reassigned variables. |
| src/app.js | Deprecated mongoose options (useCreateIndex, useFindAndModify) | MEDIUM | These options are no longer needed in Mongoose 6+; Mongoose will ignore them. Remove for cleaner config. |
| src/app.js | Promise .then().catch() for database connection | MEDIUM | Database connection setup uses callbacks. Convert to async/await for consistency. |
| src/app.js | No centralized error handling middleware | HIGH | Missing global error handler; unhandled errors won't be caught gracefully. |

## Refactoring Priority
1. **Critical Security** (Fix immediately): Replace MD5 hashing, fix NoSQL injections, add permission checks
2. **Validation** (Fix next): Add Joi validation middleware to all routes
3. **Architecture** (Refactor): Extract auth middleware, move routes to controllers, establish MVC structure
4. **Code Quality** (Polish): Replace var, convert promises, add JSDoc, centralize error handling
