# CHANGELOG

## [2.0.0 — Codebase Rescue] — 2026-05-06

---

### 🔴 Security Fixes

#### CRITICAL: Replaced MD5 with bcrypt for password hashing
- **What was wrong:** Passwords were hashed with `md5()`. MD5 is a general-purpose hash function designed to be fast — the exact opposite of what you want for passwords. A modern GPU can compute 10 billion MD5 hashes per second. Any MD5-hashed password can be cracked instantly using a rainbow table (e.g. crackstation.net).
- **Fix:** Replaced `md5` with `bcrypt.hash(password, 12)` on registration and `bcrypt.compare()` on login. The `md5` package was removed from `package.json`.
- **Improvement:** Passwords are now computationally infeasible to crack even if the database is fully compromised. 12 salt rounds means ~400ms per hash — imperceptible to users, catastrophic for attackers.

#### CRITICAL: Added Joi validation on all request bodies
- **What was wrong:** `req.body` was spread directly into Mongoose documents with no validation. An attacker could send `{ "role": "admin" }` during registration to escalate privileges, or send `{ "$gt": "" }` for NoSQL injection.
- **Fix:** Joi schemas defined in `src/validators/` validate every POST/PATCH body. The `validate` middleware uses `stripUnknown: true` to remove any fields not declared in the schema before they reach the service layer.
- **Improvement:** All inputs are validated and sanitised. Unknown fields are silently stripped. Validation errors return `422` with a clear list of all failures.

#### CRITICAL: Added `.env` to `.gitignore`
- **What was wrong:** `.env` was not listed in `.gitignore`. If the repository were ever made public or accidentally pushed, `JWT_SECRET` and `DATABASE_URL` would be exposed.
- **Fix:** `.env` added as the first entry in `.gitignore`.
- **Improvement:** Secrets can no longer be accidentally committed to version control.

---

### 🟠 Architecture Refactors

#### Restructured flat `routes.js` into MVC
- **What was wrong:** A single `src/routes.js` file handled routing, JWT verification, business logic, database queries, and error handling simultaneously. 300+ lines with no separation of concerns.
- **Fix:** Split into `routes/`, `controllers/`, `services/`, `models/`, `middlewares/`, `validators/`, and `utils/` directories. Each layer has exactly one responsibility.
- **Improvement:** Any layer can be changed, tested, or replaced independently. Adding a new route now takes ~5 lines across 3 files instead of 50 lines in one.

#### Extracted JWT auth into a single middleware
- **What was wrong:** The same 6-line JWT verification block was copy-pasted into every protected route (5 copies). Any change to auth logic required updating 5 places.
- **Fix:** Extracted into `src/middlewares/auth.middleware.js` with `authenticate` and `requireAdmin` functions. Applied via `router.use(authenticate)` in shipment routes.
- **Improvement:** Auth logic lives in one place. Changing the token format, adding refresh tokens, or switching auth libraries requires editing one file.

#### Replaced `var` with `const`/`let` throughout
- **What was wrong:** Every variable declaration used `var`, which is function-scoped and hoisted. This causes subtle bugs that are notoriously hard to debug.
- **Fix:** All `var` replaced with `const` (for values that are never reassigned) or `let` (for loop counters and reassigned variables).
- **Improvement:** Block-scoped variables, no hoisting surprises, clearer intent.

#### Rewrote all `.then()` chains as `async`/`await`
- **What was wrong:** All async operations used nested `.then()` callbacks. Inner promises (e.g. the `User.findById` inside the shipment loop) had no `.catch()`, causing silent failures.
- **Fix:** All service and controller functions use `async`/`await`. Errors propagate naturally to the central error handler via `next(err)`.
- **Improvement:** Linear, readable code. No silent failures. Error handling is centralised.

---

### 🟡 Performance Fixes

#### Fixed N+1 query in `GET /shipments`
- **What was wrong:** The shipment listing route fetched all shipments, then called `User.findById()` inside a `for` loop for each one. 100 shipments = 101 database round trips. The inner query also had no `.catch()`, so any failure silently dropped that shipment from the response.
- **Fix:** Replaced the loop with `.populate('userId', 'name email role')` on the initial `Shipment.find()` query.
- **Improvement:** Always exactly 2 database queries regardless of result count. No silent failures.

---

### 🟢 Security Hardening

#### Added ownership check to `DELETE /shipments/:id`
- **What was wrong:** Any authenticated user could delete any shipment by ID. There was no check that the requesting user owned the shipment.
- **Fix:** `shipmentService.deleteShipment()` verifies `shipment.userId === requestingUserId` before deletion. Admins bypass this check.
- **Improvement:** Users can only delete their own shipments.

#### Passwords excluded from all API responses
- **What was wrong:** The `POST /register` response returned the full user document including the password hash.
- **Fix:** Added a `toJSON` transform to `User.model.js` that deletes the `password` field before serialisation.
- **Improvement:** Password hashes are never exposed in any API response.

#### Proper HTTP status codes on all responses
- **What was wrong:** Every response — success, auth failure, not found, server error — returned `200 OK`. Clients could not distinguish outcomes without parsing the body.
- **Fix:** `201` for created resources, `200` for success, `401` for auth failures, `403` for forbidden, `404` for not found, `409` for conflicts, `422` for validation errors, `500` for server errors.
- **Improvement:** Standard HTTP semantics. Any HTTP client, proxy, or monitoring tool can correctly interpret responses.

---

### 🔵 Code Quality

#### Added centralized error handling middleware
- **What was wrong:** Every route had its own `try/catch` with different error response shapes. Changing the error format required updating every handler.
- **Fix:** Single `src/middlewares/error.middleware.js` handles all error types. Controllers call `next(err)` and the middleware formats the response.
- **Improvement:** One place to change error format, logging, or monitoring integration.

#### Added custom error classes
- **What was wrong:** Errors were thrown as plain `new Error()` strings with no status code attached. The catch block had to guess the right HTTP status.
- **Fix:** `src/utils/errors.util.js` defines `NotFoundError`, `UnauthorizedError`, `ForbiddenError`, `ConflictError`, `ValidationError` — each carrying its own `statusCode`.
- **Improvement:** Throw `new NotFoundError('Shipment not found')` anywhere in the service layer and the correct `404` response is sent automatically.

#### Removed dead code and unused imports
- **What was wrong:** `path`, `fs`, and `http` were imported but never used. Two large commented-out route blocks remained. A 200-iteration empty `for` loop existed to pad line count.
- **Fix:** All unused imports removed. Dead code blocks deleted. Padding loop removed.
- **Improvement:** Every line in the codebase now has a purpose.

#### Added JSDoc to all exported functions
- **What was wrong:** No function had documentation. Parameter types, return values, and thrown errors were undiscoverable without reading the full implementation.
- **Fix:** Every exported function in `services/`, `controllers/`, `middlewares/`, and `utils/` has a JSDoc block with `@param`, `@returns`, and `@throws` tags.
- **Improvement:** Editor autocomplete shows types and descriptions on hover. New developers understand function contracts without reading implementations.

---

### 📦 Dependency Changes

| Change | Package | Reason |
|--------|---------|--------|
| Added | `bcrypt@^5.1.1` | Secure password hashing |
| Added | `joi@^17.13.3` | Input validation |
| Removed | `md5` | Insecure — replaced by bcrypt |
| Removed | `body-parser` | Redundant — `express.json()` is built-in since Express 4.16 |
