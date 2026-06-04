# Codebase Audit

## Summary
- Total smells found: **21**
- Critical: **5** | High: **5** | Medium: **11**

## Issues

| # | File | Line(s) | Issue | Severity | Explanation |
|---|------|---------|-------|----------|-------------|
| 1 | `src/routes.js` | 9 | MD5 password hashing (import) | CRITICAL | MD5 is not a password hashing algorithm. Rainbow tables crack it in under a second. Must use bcrypt with 12+ salt rounds. |
| 2 | `src/routes.js` | 32 | MD5 used at registration | CRITICAL | `md5(userData.password)` produces an unsalted, instantly-crackable hash stored in the DB. |
| 3 | `src/routes.js` | 30 | NoSQL injection via spread (register) | CRITICAL | `{ ...req.body }` allows an attacker to inject any field, e.g. `{ role: "admin" }`, bypassing access controls. |
| 4 | `src/routes.js` | 186-191 | NoSQL injection via spread (shipment) | CRITICAL | Same spread-of-req.body pattern in shipment creation allows injecting arbitrary fields. |
| 5 | `src/routes.js` | 245 | Missing authorization on delete | CRITICAL | Any authenticated user can delete ANY shipment. No ownership check, no admin check. |
| 6 | `src/routes.js` | 43-44 | Password hash leaked in register response | HIGH | `res.json(user)` returns the full Mongoose document including the `password` field. |
| 7 | `src/routes.js` | 110-129 | N+1 database query in loop | HIGH | `User.findById()` called inside a `for` loop for every shipment — O(n) separate queries instead of a single `.populate()`. |
| 8 | `src/routes.js` | 127 | Silent promise failure (shipments loop) | HIGH | `.then()` with no `.catch()` inside the N+1 loop — if any query fails, the error is silently swallowed and the response may never be sent. |
| 9 | `src/routes.js` | 274 | Missing `.catch()` on profile fetch | HIGH | `User.findById().then()` with no error handler — if the query fails, the client hangs indefinitely. |
| 10 | `src/routes.js` | 91-98 (×6) | Duplicated auth block | HIGH | Identical JWT verification code is copy-pasted into 6 different route handlers. Should be a single middleware. |
| 11 | `src/routes.js` | 1 | `var` used throughout | MEDIUM | `var` has function-scope and hoisting issues. All should be `const` or `let`. |
| 12 | `src/routes.js` | 37-50 | Promise chains instead of async/await | MEDIUM | `.then().catch()` chains throughout reduce readability and make error handling fragile. |
| 13 | `src/routes.js` | 34,43,53,75 | Inconsistent HTTP status codes | MEDIUM | Errors return `200 OK` with `{ error: ... }` body instead of proper 4xx/5xx codes. |
| 14 | `src/routes.js` | 12-15 | Unused imports | MEDIUM | `path`, `fs`, `http` are imported but never used. `os` is only used in the `/status` debug route. |
| 15 | `src/routes.js` | 313-315 | Dead loop to pad line count | MEDIUM | Empty `for` loop iterating 200 times — does nothing, exists only to inflate line count. |
| 16 | `src/routes.js` | 278-290 | Dead/commented-out code | MEDIUM | Two old routes left in block comments. Should be deleted or moved to a test file. |
| 17 | `src/routes.js` | 18 | Hardcoded JWT fallback secret | MEDIUM | Falls back to `'secret123'` if `JWT_SECRET` env var is missing — trivially guessable. |
| 18 | `src/routes.js` | 182 | Weak tracking ID generation | MEDIUM | `Date.now() + Math.random()` is predictable and not collision-resistant. Use UUID v4. |
| 19 | `src/app.js` | 4-5 | Deprecated body-parser usage | MEDIUM | Express 4.16+ has `express.json()` built-in. The separate `body-parser` package is redundant. |
| 20 | `src/app.js` | 7 | Unused `path` import | MEDIUM | Imported but never referenced anywhere. |
| 21 | `models/User.js` | 21 | No enum validation on `role` | MEDIUM | The `role` field accepts any arbitrary string. Should be constrained to `['user', 'admin']`. |
