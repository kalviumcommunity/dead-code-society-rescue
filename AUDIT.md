# Codebase Audit — LogiTrack Backend

## Summary

- **Total smells found:** 15
- **Critical:** 3 | **High:** 6 | **Medium:** 6

---

## Issues

| File | Issue | Severity | Explanation |
|------|-------|----------|-------------|
| `src/routes.js` | MD5 used for password hashing | CRITICAL | MD5 is a general-purpose hash function, not a password hashing algorithm. A rainbow table can crack any MD5-hashed password in milliseconds. Must be replaced with bcrypt (12 rounds). |
| `src/routes.js` | `req.body` spread directly into DB without validation | CRITICAL | `{ ...req.body }` passes attacker-controlled data straight to Mongoose. An attacker can inject extra fields (e.g. `role: "admin"`) or send `{"$gt": ""}` for NoSQL injection. |
| `src/routes.js` | `.env` not in `.gitignore` | CRITICAL | The `.env` file containing `JWT_SECRET` and `DATABASE_URL` is not excluded from version control. If pushed to a public repo, all secrets are exposed. |
| `src/routes.js` | JWT auth block copy-pasted into every route (5×) | HIGH | The same 6-line JWT verification block is duplicated in every protected route. Any change to auth logic requires updating 5 places — a maintenance and consistency risk. |
| `src/routes.js` | N+1 query in `GET /shipments` | HIGH | For each shipment returned, a separate `User.findById()` call is made inside a loop. 100 shipments = 101 DB round trips. Should be replaced with `.populate()`. |
| `src/routes.js` | No input validation on any route | HIGH | No Joi/Zod schema validates request bodies. Missing fields, wrong types, and injection strings all reach the database unchecked. |
| `src/routes.js` | `DELETE /shipments/:id` has no ownership check | HIGH | Any authenticated user can delete any shipment by ID — not just their own. There is no check that `shipment.userId === req.userId`. |
| `src/routes.js` | All responses use HTTP 200 regardless of outcome | HIGH | Errors (auth failure, not found, server crash) all return `200 OK`. Clients cannot distinguish success from failure without parsing the body. |
| `src/routes.js` | `var` used throughout instead of `const`/`let` | MEDIUM | `var` is function-scoped and hoisted, which causes subtle bugs. `const`/`let` have been the standard since ES2015. |
| `src/routes.js` | `.then()` chains with no `.catch()` on inner promises | MEDIUM | The inner `User.findById()` call inside the shipment loop has no `.catch()`. A DB failure silently drops that shipment from the response with no error logged. |
| `src/routes.js` | Magic strings for status values | MEDIUM | `'pending'`, `'delivered'`, `'admin'` are hardcoded string literals scattered across the file. A typo anywhere silently breaks logic with no compile-time error. |
| `src/routes.js` | Unused imports (`path`, `fs`, `http`) | MEDIUM | `path`, `fs`, and `http` are imported but never used. Dead imports add noise and slow down readers trying to understand dependencies. |
| `src/routes.js` | Commented-out dead code blocks | MEDIUM | Two large commented-out route blocks (`/all-users`, `/test-hash`) remain in the file. Dead code should be removed — git history preserves it if needed. |
| `src/routes.js` | Padding loop `for (var i = 0; i < 200; i++)` | MEDIUM | A 200-iteration empty loop exists solely to inflate line count. This is noise that wastes CPU on startup and confuses every future reader. |
| `models/User.js` | Password field comment says "using md5 for now" | MEDIUM | The schema comment documents an insecure practice as intentional. Misleads future developers into thinking MD5 is acceptable. |

---

## Smell Tags (inline — as they appeared in `src/routes.js` before fixes)

```js
// SMELL: [CRITICAL] MD5 is not a password hashing algorithm.
// A rainbow table can crack this in milliseconds. Replace with bcrypt (12 rounds).
userData.password = md5(userData.password);

// SMELL: [CRITICAL] req.body is spread directly into userData with no validation.
// An attacker can send { role: "admin" } or NoSQL injection payloads.
var userData = { ...req.body };

// SMELL: [HIGH] JWT verification block is copy-pasted into every protected route (5 times).
// Extract into a single auth middleware in middlewares/auth.middleware.js.
var token = req.headers['authorization'];
if (!token) return res.json({ error: 'Unauthorized: missing token' });
jwt.verify(token, JWT_SECRET, function(err, decoded) { ... });

// SMELL: [HIGH] N+1 query — User.findById() called inside a loop for every shipment.
// Replace with Shipment.find().populate('userId', 'name email').
User.findById(ship.userId).then(function(u) { ... }); // inside for loop

// SMELL: [HIGH] DELETE /shipments/:id has no ownership check.
// Any authenticated user can delete any shipment. Add: if (shipment.userId !== req.userId) throw ForbiddenError.
Shipment.findByIdAndDelete(req.params.id)

// SMELL: [HIGH] All responses return HTTP 200 regardless of outcome.
// Use proper status codes: 201 Created, 401 Unauthorized, 404 Not Found, 422 Unprocessable Entity.
res.json({ error: 'Unauthorized: missing token' }); // should be res.status(401)

// SMELL: [MEDIUM] var used throughout — replace with const/let.
var token = req.headers['authorization'];

// SMELL: [MEDIUM] Inner .then() has no .catch() — silent failure drops shipments silently.
User.findById(ship.userId).then(function(u) { ... }); // no .catch()

// SMELL: [MEDIUM] Magic string 'delivered' hardcoded — define as a constant.
if (req.body.status === 'delivered') { ... }

// SMELL: [MEDIUM] Unused imports: path, fs, http are never referenced.
var path = require('path');
var fs = require('fs');
var http = require('http');

// SMELL: [MEDIUM] Dead code — commented-out routes should be deleted, not kept.
/* router.get('/all-users', ...) */
/* router.post('/test-hash', ...) */

// SMELL: [MEDIUM] Padding loop — serves no purpose, wastes CPU, confuses readers.
for (var i = 0; i < 200; i++) { }

// SMELL: [CRITICAL] .env is not in .gitignore — secrets will be committed to version control.
// Add .env to .gitignore immediately.
```
