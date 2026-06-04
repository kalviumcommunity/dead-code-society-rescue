# Codebase Audit

## Summary
- Total smells found: 18
- Critical: 4 | High: 8 | Medium: 6

## Issues

| File | Issue | Severity | Explanation |
|------|-------|----------|-------------|
| src/routes.js | MD5 password hashing | CRITICAL | MD5 is not a password algorithm; rainbow tables crack hashes instantly |
| src/routes.js | Spread `req.body` into User create | CRITICAL | NoSQL injection — attacker can pass `$gt` operators via body spread |
| src/routes.js | Spread `req.body` into Shipment create | CRITICAL | Same injection vector on shipment documents |
| src/routes.js | Hardcoded JWT fallback secret | CRITICAL | `secret123` default allows token forgery if env is unset |
| src/routes.js | N+1 queries in GET /shipments | HIGH | `User.findById` inside a loop causes one DB round-trip per shipment |
| src/routes.js | Duplicated auth block (6×) | HIGH | Copy-pasted JWT verify in every protected route — drift and bugs |
| src/routes.js | DELETE without ownership check | HIGH | Any authenticated user can delete any shipment by ID |
| src/routes.js | No input validation | HIGH | Raw `req.body` accepted on register, login, shipments |
| src/routes.js | Missing `.catch()` on profile route | HIGH | Unhandled promise rejection can crash the process |
| src/routes.js | Missing `.catch()` on inner User.findById in loop | HIGH | Silent failures; response may never be sent |
| src/routes.js | Password returned in register response | HIGH | Full user document including hash sent to client |
| src/routes.js | Inconsistent HTTP status codes | MEDIUM | Errors return 200 with `{ error }` instead of 4xx/5xx |
| src/routes.js | `var` used throughout | MEDIUM | Function-scoped `var` in loops causes closure bugs |
| src/routes.js | Promise chains instead of async/await | MEDIUM | Nested `.then()` harder to read and error-handle |
| src/routes.js | Unused imports (path, fs, http) | MEDIUM | Dead code obscures real dependencies |
| src/routes.js | Magic strings for status/roles | MEDIUM | `'pending'`, `'delivered'` scattered with no enum |
| src/routes.js | No centralized error handler | MEDIUM | Each route handles errors differently |
| src/app.js | No 404 or global error middleware | MEDIUM | Unhandled routes fall through with no consistent shape |

## Original smell examples (from pre-refactor `routes.js`)

```javascript
// SMELL: [CRITICAL] MD5 is not a password hashing algorithm. Use bcrypt with 12 rounds.
userData.password = md5(userData.password);

// SMELL: [CRITICAL] Spreading req.body enables NoSQL operator injection ($gt, $where, etc.).
var userData = { ...req.body };

// SMELL: [HIGH] N+1 query — database called inside a loop for each shipment.
User.findById(ship.userId).then(function(u) { ... });

// SMELL: [HIGH] No permission check — any token holder can delete any shipment.
Shipment.findByIdAndDelete(req.params.id)
```
