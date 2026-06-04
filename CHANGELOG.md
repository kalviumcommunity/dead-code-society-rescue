# Changelog

All notable changes to LogiTrack backend are documented here.
Format loosely follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [2.0.0] — Codebase Rescue

### audit: tag all code smells and write AUDIT.md

**What was wrong:** The codebase had 13 tagged issues — 5 critical, 6 high, 2 medium — with no documentation of them anywhere.

**What changed:** Every problem was tagged inline with `// SMELL: [SEVERITY]` comments and catalogued in `AUDIT.md` with file, severity, and explanation for each.

---

### refactor: restructure flat codebase into MVC architecture

**What was wrong:** All routing, business logic, authentication, and database calls lived inside a single 600-line `src/routes.js` file. There was no separation of concerns, making the code impossible to test, maintain, or reason about independently.

**What changed:** Code is split into distinct layers under `src/`:
- `routes/` — URL + HTTP method only, delegates to controller
- `controllers/` — reads `req`, calls a service, sends `res`; no DB calls
- `services/` — all business logic and DB queries
- `models/` — Mongoose schemas only
- `middlewares/` — auth, validation, error handler
- `validators/` — Joi schemas per route group
- `utils/` — JWT helpers, custom error classes

**Why it's better:** Each layer has a single responsibility. A new engineer can find auth logic in `auth.service.js` without searching through 600 lines. Controllers can be tested by mocking services. Services can be tested without HTTP.

---

### refactor: replace var with const/let, rewrite promises as async/await

**What was wrong:** All variables were declared with `var`, which has function scope and hoisting behaviour that causes subtle bugs. All async code used `.then().catch()` chains, producing deeply nested, hard-to-follow callback pyramids.

**What changed:**
- Every `var` replaced with `const` (for values that are never reassigned) or `let` (for loop counters and reassigned values).
- All `.then().catch()` chains replaced with `async/await` + `try/catch` at the controller layer, with errors passed to `next(err)` for the centralized handler.

---

### feat: add Joi validation middleware on all routes

**What was wrong:** Routes called `...req.body` directly with no validation. This allowed mass assignment (a client could send `role: "admin"` and it would be saved), malformed data, and NoSQL injection via operator keys like `$gt`.

**What changed:**
- `src/validators/auth.validator.js` — schemas for register and login
- `src/validators/shipment.validator.js` — schemas for create and status update
- `src/middlewares/validate.middleware.js` — factory middleware that runs `schema.validate` with `stripUnknown: true` and `abortEarly: false`, returns 422 with all field errors if validation fails, replaces `req.body` with the clean value on success

**Why it's better:** Unknown fields are stripped before they reach the service layer. Field-level error messages are returned to the client. Mass assignment is structurally impossible because only explicitly listed fields pass through.

---

### security: replace MD5 with bcrypt, extract auth middleware

**What was wrong:**
1. Passwords were hashed with MD5 — a general-purpose hash, not a password hash. MD5 has no salt and no work factor, so a rainbow table or GPU cracking can reverse common passwords in under a second.
2. JWT verification was copy-pasted identically into every single route handler (7 times). Any bug in that block had to be fixed in 7 places.
3. The JWT secret fell back to `'secret123'` if `JWT_SECRET` was not set, meaning any attacker who read the source could forge tokens in misconfigured deployments.

**What changed:**
- `md5` dependency removed from `package.json`.
- `bcrypt` added with 12 salt rounds used on every `register` call.
- `bcrypt.compare` used on every `login` call.
- `src/utils/jwt.util.js` centralises `signToken` and `verifyToken`.
- `src/middlewares/auth.middleware.js` is the single location for JWT verification — all protected routes use `authenticate` middleware.
- `jwt.util.js` throws an exception at startup if `JWT_SECRET` is missing, preventing silent fallback to a weak default.

---

### refactor: add centralized error middleware, remove duplicate try/catch blocks

**What was wrong:** Each route had its own `res.json({ error: '...' })` return for every error case, with inconsistent status codes (mostly 200 for everything including errors and 404s). Mongoose errors like duplicate key were not handled, leaking raw error objects to the client.

**What changed:**
- `src/utils/errors.util.js` defines `AppError`, `NotFoundError`, `UnauthorizedError`, `ForbiddenError`, `ConflictError`, and `ValidationError` — each carrying its own HTTP status code.
- `src/middlewares/errorHandler.middleware.js` is the single last `app.use()`. It handles operational errors, Mongoose duplicate-key errors (code 11000 → 409), and unexpected errors (500 with no internals exposed).
- Controllers call `next(err)` inside their `catch` block. Zero inline `res.json({ error })` calls remain in routes or controllers.

---

### perf: fix N+1 queries with populate

**What was wrong:** `GET /shipments` fetched all shipments for a user, then looped over every result and called `User.findById(ship.userId)` inside that loop. For a user with 50 shipments this meant 51 database round-trips (1 to find shipments + 50 to find the user for each one). The inner promise also had no `.catch()`, meaning any single failure would silently hang the request.

**What changed:** `shipment.service.js` uses `Shipment.find({ userId }).populate('userId', 'name email role')`. Mongoose resolves the reference in a single additional query (or as part of an aggregation), regardless of how many shipments are returned.

**Before:** 1 + N database queries per request.
**After:** 2 database queries per request (constant, independent of shipment count).

---

### security: add ownership checks to delete and update routes

**What was wrong:** `DELETE /shipments/:id` had no ownership check — any authenticated user with a valid token could delete any other user's shipment by guessing or iterating IDs.

**What changed:** `shipment.service.js` fetches the shipment first, compares `shipment.userId` to `req.userId`, and throws `ForbiddenError` if they don't match and the user is not an admin. This check is applied to delete, single-fetch, and status-update operations.

---

### docs: add JSDoc to all exported functions

**What was wrong:** No functions had parameter types, return types, or documented error cases. A new engineer had to read every function body to understand its contract.

**What changed:** Every exported function in `services/`, `controllers/`, `middlewares/`, and `utils/` has a JSDoc block with `@param`, `@returns`, and `@throws` where applicable.

---

### docs: write README and CHANGELOG

**What was wrong:** The README was a single line. There was no documentation for environment variables, API endpoints, folder structure, or setup steps. The `.env.example` had three uncommented variables.

**What changed:**
- `README.md` — overview, tech stack table, quick start, env variable table, folder structure, ASCII architecture diagram, full API reference with method/endpoint/auth/description, example curl commands.
- `CHANGELOG.md` — this file. Every change is documented with what was wrong, what changed, and why it is better.
- `.env.example` — every variable is commented with its purpose, whether it is required, and an example value.
