# Changelog

All notable refactoring decisions for the LogiTrack codebase rescue.

## [2.0.0] — Codebase rescue

### Audit and documentation
- **What was wrong:** Single 600-line `routes.js`, no audit trail, empty `AUDIT.md`.
- **Change:** Documented 18 smells in `AUDIT.md` (4 critical, 8 high, 6 medium).
- **Improvement:** Next engineer can see known risks and what was fixed.

### MVC restructure
- **What was wrong:** Routing, hashing, validation, DB access, and auth duplicated in one file.
- **Change:** Split into `routes/`, `controllers/`, `services/`, `models/`, `middlewares/`, `validators/`, `utils/`. Entry point is `src/server.js` + `src/app.js`.
- **Improvement:** Each layer has one job; files are small and navigable.

### `var` → `const` / `let` and async/await
- **What was wrong:** `var` in loops and nested `.then()` chains with missing `.catch()`.
- **Change:** Modern declarations and `async` functions in services/controllers.
- **Improvement:** Fewer closure bugs and clearer error propagation via `next(err)`.

### Joi validation
- **What was wrong:** Raw `req.body` spread into Mongoose documents (NoSQL injection risk).
- **Change:** `validators/` + `validate.middleware.js`; unknown fields stripped; 422 with error array on failure.
- **Improvement:** Only whitelisted fields reach the database.

### Security: bcrypt and JWT
- **What was wrong:** MD5 passwords; default JWT secret `secret123`; password in API responses.
- **Change:** `bcrypt` with 12 rounds; `JWT_SECRET` required; `password` field `select: false`; `auth.middleware.js` for protected routes.
- **Improvement:** Passwords resist offline attacks; tokens cannot be forged with a hardcoded secret.

### Centralized errors
- **What was wrong:** Inconsistent `{ error }` JSON with HTTP 200; scattered try/catch.
- **Change:** `AppError` hierarchy + `errorHandler.middleware.js` as last middleware.
- **Improvement:** Predictable status codes (401, 403, 404, 409, 422, 500).

### N+1 query fix
- **What was wrong:** `GET /shipments` called `User.findById` inside a `for` loop (1 + N queries).
- **Change:** Single query with `.populate('userId', 'name email role')`.
- **Improvement:** One round-trip regardless of shipment count (was N+1, now 1 query).

### Authorization fixes
- **What was wrong:** `DELETE /shipments/:id` had no ownership check.
- **Change:** Delete and read enforce owner-or-admin in `shipment.service.js`.
- **Improvement:** Users cannot delete others' shipments.

### JSDoc
- **What was wrong:** No inline documentation on exported functions.
- **Change:** JSDoc on exported functions in services, controllers, utils, and middlewares.
- **Improvement:** IDE hints and faster onboarding.

### Dependencies
- **Removed:** `md5`
- **Added:** `bcrypt`, `joi`

### API paths
- **Added:** `/api/auth/register`, `/api/auth/login`, `/api/health`
- **Kept:** `/api/register`, `/api/login` as aliases for backward compatibility
