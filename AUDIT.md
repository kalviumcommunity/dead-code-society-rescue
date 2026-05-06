# Codebase Audit - LogiTrack Backend

## Summary
- Total smells found: 20
- Critical: 5 | High: 8 | Medium: 7

## Issues

| File | Issue | Severity | Explanation |
|------|-------|----------|-------------|
| src/routes.js | MD5 password hashing on registration (line 24) | CRITICAL | MD5 is a hash function, not a password hashing algorithm. Rainbow tables can crack MD5 in milliseconds. Attackers can pre-compute all common passwords and instantly identify them. |
| src/routes.js | MD5 password hashing on login (line 59) | CRITICAL | Same vulnerability as above. Use bcrypt with 12 salt rounds for production security. |
| src/routes.js | No input validation on /register (line 18) | CRITICAL | req.body is spread directly to User model. Attacker can inject `{"role": "admin"}` or `{"__v": 999}` to bypass restrictions. Use Joi schema. |
| src/routes.js | No input validation on /shipments POST (line 155) | CRITICAL | req.body is spread directly to Shipment model. NoSQL injection or field injection possible. Use Joi schema validation. |
| src/routes.js | .env file not in .gitignore (line N/A) | CRITICAL | JWT_SECRET "super_secret_logitrack_2019_dont_share" is exposed in .env.example and will be committed if .env is not in .gitignore. Check .gitignore file. |
| src/routes.js | Duplicate JWT verification block repeated 6+ times (lines 46-52, 80-86, 145-151, 170-176, 195-201, 265-271) | HIGH | Same 6-line auth check copy-pasted in every protected route. If auth logic changes, must update all places. Extract to auth middleware. |
| src/routes.js | N+1 query problem in /shipments GET (lines 103-125) | HIGH | For each of N shipments, the code calls User.findById() in a loop, resulting in 1 + N database queries. For 100 shipments = 101 DB round trips. Use Mongoose populate() or aggregation pipeline. |
| src/routes.js | Promise chains without .catch() on /profile (line 280) | HIGH | User.findById().then() has no .catch() block. Silent failure if the query errors - the response never sends and the request hangs. |
| src/routes.js | Missing permission check on DELETE /shipments/:id (line 207) | HIGH | No check if the shipment belongs to the user. Any authenticated user can delete any shipment by ID. Permission check must verify `shipment.userId === req.userId` or user is admin. |
| src/routes.js | All var instead of const/let throughout (lines 1-320) | HIGH | var has function-scoped hoisting and is deprecated since ES2015. Use const by default, let only if reassigned. Makes code harder to reason about. |
| src/routes.js | Promise chains with .then() instead of async/await (lines 21-45, 47-75, 85-130, etc.) | HIGH | Nested .then().then().catch() is harder to read and debug than async/await. Async/await looks like synchronous code but is non-blocking. |
| src/routes.js | All responses use 200 status code (lines 39, 68, 105, etc.) | HIGH | Both success and error responses are 200 OK. Should be 201 for POST create, 400 for validation errors, 401 for auth errors, 404 for not found, 422 for validation failed. |
| src/routes.js | Magic strings for status and role ('pending', 'admin', 'user', 'delivered') | MEDIUM | Hardcoded strings scattered throughout. If status values change, must search entire codebase. Define constants in one place. |
| src/routes.js | Unused imports (path, fs, http, os on lines 8-11) | MEDIUM | These modules are imported but never used. Increases bundle size and confuses readers about dependencies. |
| src/routes.js | Dead code - commented routes (lines 286-297) | MEDIUM | Old code left commented out instead of deleted. Creates confusion about what is live. If it's needed, use git history. Delete it. |
| src/routes.js | TODO comments in production code (lines 299-302) | MEDIUM | "TODO: fix the N+1 problem later", "TODO: refactor into proper controllers". These indicate incomplete work. Either fix it or remove the comment. |
| src/routes.js | Padding code at bottom (lines 305-309) | MEDIUM | Loop from 0 to 200 that does nothing. Appears to be added just to hit line count. Dead code that wastes space. |
| src/routes.js | No centralized error handling (scattered try/catch and manual error returns) | MEDIUM | Error responses are inconsistent. Some return `{error: msg}`, others `{message: msg}`. No HTTP status codes. Impossible to write a consistent error handler on the frontend. |
| src/app.js | No 404 handler registered (last line) | MEDIUM | When user hits an undefined route, Express will return generic 404. Should have a custom 404 middleware that returns standardized error response. |
| models/User.js | Password stored as plain String type without validation (line 13) | MEDIUM | No type-level enforcement that password is hashed. Schema should not allow plaintext. Consider a virtual property that validates hash format. |

## Detection Method
All issues were identified by reading src/routes.js, models/User.js, models/Shipment.js, src/app.js, and package.json.
Each smell was tagged by matching the 10 most common Node.js backend smells against the actual code.
