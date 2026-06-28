# Changelog

All notable changes made during the LogiTrack codebase rescue, in the order they were applied.
Each entry explains what was wrong, what changed, and why it's better.

## Architecture

### Restructured flat `routes.js` into MVC layers
- **What was wrong:** Everything — routing, auth, hashing, validation, database calls and
  error handling — lived in one 600-line file. Any change risked breaking something unrelated,
  and there was no separation between "what URL maps to what" and "what actually happens."
- **What changed:** Split into `src/routes/`, `src/controllers/`, `src/services/`,
  `src/models/`, `src/middlewares/`, and `src/utils/`. Routes only map a URL+method to a
  controller function. Controllers read the request, call a service, and send the response —
  they never touch the database directly. Services hold all business logic and are the only
  layer allowed to call models.
- **Why it's better:** Each layer has one job. A new engineer can find "where does login
  actually check the password" by going straight to `auth.service.js` instead of scanning
  600 lines. Routes, controllers and services can now be tested independently.

## Code Quality

### Replaced `var` with `const`/`let` throughout
- **What was wrong:** `var` is function-scoped, not block-scoped, which led to bugs like the
  IIFE workaround in the original N+1 loop (needed purely to capture the right `i` per
  iteration — a non-issue with `let`).
- **What changed:** Every declaration is now `const` by default, `let` only where a variable
  is genuinely reassigned.
- **Why it's better:** Removes an entire class of scoping bugs and makes intent clear — if
  you see `const`, you know that binding never changes.

### Rewrote `.then().catch()` chains as `async`/`await`
- **What was wrong:** Nested `.then()` chains were hard to read, and several had no
  `.catch()` at all (e.g. the original `/profile` route), meaning a rejected promise produced
  an unhandled rejection and a hung request instead of a response.
- **What changed:** All request-handling code now uses `async`/`await` with a single
  `try { ... } catch (error) { next(error) }` block per controller function.
- **Why it's better:** Linear, readable control flow, and no request can silently hang —
  every error path reaches the centralized error handler.

## Security

### Replaced MD5 with bcrypt for password hashing
- **What was wrong:** MD5 has no salt and is fast by design — both qualities are the opposite
  of what you want for password storage. A leaked database could be cracked almost instantly.
- **What changed:** Passwords are now hashed with bcrypt (12 salt rounds) via a `pre('save')`
  hook on the `User` model, and verified at login with `bcrypt.compare`.
- **Why it's better:** bcrypt is deliberately slow and salts automatically, making brute-force
  and rainbow-table attacks impractical.

### Extracted JWT verification into `auth.middleware.js`
- **What was wrong:** Every protected route hand-rolled the same six lines of token
  extraction and `jwt.verify()`, copy-pasted seven times.
- **What changed:** A single `auth` middleware now verifies the token once and attaches
  `req.user`; routes just add `auth` to their middleware chain.
- **Why it's better:** One place to fix or extend auth logic instead of seven. Removes the
  risk of one route's copy drifting out of sync with the others.

### Added Joi validation on every route that accepts a body
- **What was wrong:** Request bodies were spread directly into Mongoose model constructors
  (`{ ...req.body }`), which is a mass-assignment risk — a client could send unexpected fields
  (like `role: 'admin'`) and have them saved as-is.
- **What changed:** Every POST/PUT/PATCH route now validates and strips `req.body` through a
  Joi schema (`validation.middleware.js`) before it reaches the controller, returning HTTP 422
  with specific error messages on failure.
- **Why it's better:** Only explicitly-allowed fields ever reach a service or model. Bad input
  is rejected with a clear, structured error instead of silently corrupting data or crashing
  later.

## Reliability Fixes (found during restructuring)

These weren't visible as smells in the original flat file — they were introduced or exposed
partway through the MVC split and fixed once spotted.

### Fixed double password hashing on register
- **What was wrong:** `auth.service.js` called a manual `hashPassword()` helper *and* the
  `User` model had a `pre('save')` hook that hashes the password again. The password was being
  hashed twice, so the stored hash never matched what `bcrypt.compare()` checked at login —
  every account would have been locked out immediately after registering.
- **What changed:** Removed the manual hash call from the service; the model's `pre('save')`
  hook is now the single source of truth for password hashing.
- **Why it's better:** One hashing path means one thing to test and reason about, and login
  actually works.

### Fixed login fetching the password field
- **What was wrong:** The `User` schema marks `password` as `select: false` (correctly, so it
  never leaks in normal queries) — but the login query never explicitly asked for it back,
  so `comparePassword()` was always comparing against `undefined`.
- **What changed:** The login query now uses `.select('+password')` to retrieve the hash only
  for that one comparison.
- **Why it's better:** Login works correctly, and the password still never leaks anywhere else
  in the app.

### Fixed shipment owner field name mismatch (`userId` vs `user`)
- **What was wrong:** The `Shipment` schema's owner field is `user` (with `ref: 'User'` for
  population), but the service layer queried and wrote `userId` — a field that doesn't exist
  on the schema. Shipments were being created without a real owner reference, and
  `.populate('userId')` had nothing to populate.
- **What changed:** Service layer now consistently uses `user` to match the schema.
- **Why it's better:** Shipments are correctly linked to their owner, and `.populate()` works.

### Fixed `trackingNumber` vs `trackingId` mismatch
- **What was wrong:** The schema requires `trackingNumber`, but the service generated and set
  `trackingId`, which the schema doesn't define — so the actual required field was always left
  empty and would fail schema validation on save.
- **What changed:** Service now sets `trackingNumber` to match the schema.
- **Why it's better:** Shipment creation succeeds and the generated tracking number is
  actually persisted.

### Fixed shipment status enum mismatch between Joi and Mongoose
- **What was wrong:** The Joi validator accepted `"in-progress"` and `"cancelled"` as valid
  statuses, but the Mongoose schema's enum only allows `"pending"`, `"in_transit"`, and
  `"delivered"`. A request with `status: "in-progress"` would pass validation and then crash
  with a Mongoose `ValidationError` at the database layer.
- **What changed:** Joi's allowed values now match the schema enum exactly.
- **Why it's better:** No more requests that pass validation only to fail later for a
  different reason — the two layers agree on what's valid.

### Added missing `role` field to the `User` schema
- **What was wrong:** `auth.service.js` puts `role` into the JWT payload, and
  `shipment.service.js` checks `req.user.role` to decide if someone can mark a shipment
  delivered — but the `User` schema never defined a `role` field, so it was always
  `undefined`. No one could ever be recognized as an admin.
- **What changed:** Added `role: { type: String, enum: ['user', 'admin'], default: 'user' }`
  to the schema.
- **Why it's better:** The admin-only "mark as delivered" permission check actually works now.

### Wired up `src/config/db.js` instead of leaving it unused
- **What was wrong:** A `connectDB()` helper existed in `src/config/db.js` but was never
  imported anywhere — `app.js` connected to MongoDB with its own inline `mongoose.connect()`
  call instead, and the unused helper referenced a different env var name (`MONGO_URI`) than
  the one actually used (`DATABASE_URL`).
- **What changed:** `app.js` now imports and calls `connectDB()` from `src/config/db.js`,
  which was corrected to read `DATABASE_URL`. The inline connection logic was removed.
- **Why it's better:** One connection path, no dead code, and the env var name is consistent
  everywhere it's referenced.

### Restored `GET /shipments/:id` and `DELETE /shipments/:id`, with proper ownership checks
- **What was wrong:** These two routes existed in the original codebase but were dropped
  during the MVC restructure. The original `DELETE` route also had no ownership or role
  check at all — any authenticated user could delete *any* shipment in the system, not just
  their own.
- **What changed:** Both routes are back, wired through `shipment.routes.js` →
  `shipment.controller.js` → new `getShipmentById`/`removeShipment` functions in
  `shipment.service.js`. Both now check that the requester is either the shipment's owner or
  an admin before allowing access, throwing a `ForbiddenError` otherwise.
- **Why it's better:** No functionality was silently lost in the rescue, and the
  no-permission-check vulnerability from the original code is fixed rather than carried
  forward.

## Performance

### Fixed N+1 query in shipment listing
- **What was wrong:** `GET /shipments` fetched all shipments, then looped over them calling
  `User.findById()` once per shipment — N+1 queries for N shipments.
- **What changed:** Replaced the loop with a single `.populate('user')` call on the
  Mongoose query.
- **Why it's better:** One query instead of N+1, regardless of how many shipments a user has.

## Error Handling

### Added centralized error middleware and custom error classes
- **What was wrong:** Every route returned a different ad-hoc error shape, and almost every
  route returned HTTP 200 even when something failed, breaking standard HTTP semantics.
- **What changed:** Added `AppError` and subclasses (`NotFoundError`, `UnauthorizedError`,
  `ForbiddenError`, `ConflictError`), each carrying the correct HTTP status code. Controllers
  now just `throw` or `next(err)` and a single `error.middleware.js`, mounted last in
  `app.js`, formats every error response consistently.
- **Why it's better:** Every error response now has a predictable shape and the correct
  status code, and there's one place to add new error types or change the response format.

## Documentation

### Added JSDoc to exported functions in services, controllers, middlewares and utils
- **What changed:** Documented parameters, return types, and thrown error types for the
  functions that make up the application's public surface within each module.

### Rewrote README.md
- **What was wrong:** The README was a placeholder with emoji branding, no real setup
  instructions beyond `npm install`/`npm run dev`, no environment variable documentation, and
  a note to "check with the lead developer" for database issues — exactly the kind of tribal
  knowledge this rescue was meant to eliminate.
- **What changed:** Added a tech stack table, a documented environment variable table, a full
  API reference table (method, endpoint, auth requirement, description), and an ASCII
  architecture diagram, so a new engineer can go from clone to running server without asking
  anyone.

### Removed all `// SMELL:` tags
- **What changed:** Once every tagged issue was fixed and recorded in `AUDIT.md`, the inline
  `// SMELL:` comments were removed from the codebase, since their purpose was to flag work
  that needed doing, not to remain as permanent annotations.
