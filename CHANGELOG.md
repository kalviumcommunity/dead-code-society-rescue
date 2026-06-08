# CHANGELOG

## [2.0.0] - 2026-06-08

### Breaking Changes
- Main entry point changed from `src/app.js` to `src/server.js`
- Routes reorganized: `/api/auth`, `/api/users`, `/api/shipments` (was all under `/api`)
- Password hashing algorithm changed from MD5 to bcrypt (v1 passwords no longer valid)
- JWT validation now enforces HS256 algorithm only
- HTTP status codes now follow REST standards (no longer all 200)

### Security Fixes - CRITICAL

#### 1. Password Hashing: MD5 → bcrypt (12 rounds)
**Problem**: MD5 is a general-purpose hash function, not a password hashing algorithm. Rainbow tables can crack MD5-hashed passwords in milliseconds.

**Fix**: Replaced with bcrypt using 12 salt rounds (~400ms per authentication attempt). Even with database compromise, passwords are computationally infeasible to crack.

**Migration**: 
- All existing user passwords must be re-hashed
- Users must reset passwords on first login to v2.0.0
- See [Security Migration Guide](#security-migration-guide) below

#### 2. Input Validation: None → Joi with Sanitization
**Problem**: `req.body` was passed directly to Mongoose via spread operator (`{ ...req.body }`), enabling NoSQL injection attacks like `{"$gt": ""}`.

**Fix**: Added Joi schemas on all endpoints with `stripUnknown: true` to remove unexpected fields before DB operations.

**Impact**: Prevents NoSQL injection, type coercion attacks, and extra field injection (e.g., `role: "admin"` in register).

#### 3. JWT Secret Enforcement
**Problem**: Default fallback was `'secret123'` (weak, hardcoded).

**Fix**: JWT_SECRET now enforced to minimum 32 characters. Application fails to start if not set.

**Migration**: Update `.env` with a strong secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### 4. Weak HTTP Status Codes
**Problem**: All responses returned 200, making error handling impossible for clients.

**Fix**: 
- 201 Created (successful registration, shipment creation)
- 401 Unauthorized (missing/invalid token)
- 403 Forbidden (insufficient permissions)
- 404 Not Found (resource doesn't exist)
- 409 Conflict (duplicate email)
- 422 Validation Failed (bad input)
- 500 Internal Server Error (server errors)

### Architecture Refactors

#### God File → MVC Architecture
**Before**: Single `src/routes.js` (600+ lines) handled routing, validation, business logic, DB queries, error handling.

**After**: 
- `routes/` - Only route definitions
- `controllers/` - Request handlers
- `services/` - Business logic & DB queries
- `models/` - Mongoose schemas
- `middlewares/` - Auth, validation, error handling
- `utils/` - Reusable functions (hashing, JWT, errors)

Each layer has one responsibility.

#### Duplicate Auth Blocks → Reusable Middleware
**Before**: `jwt.verify()` block copied 6 times in routes.js

**After**: Single `requireAuth` and `requireAdmin` middleware

#### Promise Chains → Async/Await
**Before**: Nested `.then().then().catch()` chains with missing error handlers

**After**: Clean async/await with centralized error handling middleware

#### var → const/let
**Before**: Function-scoped `var` causing hoisting bugs

**After**: Block-scoped `const` and `let` throughout

### Performance Fixes

#### N+1 Query Problem: Resolved
**Before**: Fetching 100 shipments triggered 101 DB queries:
```javascript
const shipments = Shipment.find()
for (const s of shipments) {
  const user = User.findById(s.userId)  // 1 query per shipment = N queries
}
// Total: 1 + N queries
```

**After**: Using Mongoose `.populate()` - always 1-2 queries:
```javascript
const shipments = Shipment.find().populate('userId', 'name email')
// Total: 1 query regardless of shipment count
```

### Code Quality Improvements

#### Error Handling
- Added custom error classes: `AppError`, `ValidationError`, `UnauthorizedError`, `ForbiddenError`, `NotFoundError`, `ConflictError`
- Centralized error middleware catches all errors
- Stack traces logged server-side, safe error messages sent to clients
- No sensitive data leaked in production errors

#### Input Validation
- `registerSchema`: email format, password strength (8+ chars, uppercase, digit), name length
- `loginSchema`: email format, password required
- `createShipmentSchema`: origin/destination length, weight positive, carrier enum, sanitizes unknown fields
- `updateShipmentStatusSchema`: status must be in enum

#### JSDoc Comments
- All service functions documented with:
  - One-line description
  - `@param` with types and descriptions
  - `@returns` with type and description
  - `@throws` for error cases
  - `@example` usage

#### Logging
- Error middleware logs errors with ISO timestamp and error name

### Dependencies Updated

```json
{
  "express": "^4.17.1 → ^4.21.2",
  "jsonwebtoken": "^8.5.1 → ^9.0.3",
  "mongoose": "^5.10.0 → ^9.6.3",
  "dotenv": "^8.2.0 → ^16.4.5",
  "body-parser": "REMOVED (Express has built-in json parser)",
  "md5": "REMOVED (replaced with bcrypt)",
  "bcrypt": "ADDED ^5.1.1",
  "joi": "ADDED ^17.13.3"
}
```

### Endpoint Changes

#### Before (v1.0.0)
```
POST   /api/register
POST   /api/login
GET    /api/profile
GET    /api/shipments
POST   /api/shipments
GET    /api/shipments/:id
PATCH  /api/shipments/:id/status
DELETE /api/shipments/:id
```

#### After (v2.0.0)
```
POST   /api/auth/register          (new path)
POST   /api/auth/login             (new path)
GET    /api/users/profile          (new path)
GET    /api/shipments
POST   /api/shipments
GET    /api/shipments/:id
PATCH  /api/shipments/:id/status
DELETE /api/shipments/:id
GET    /api/health                 (new health check)
```

### Migration Guide

#### 1. Update .env
```bash
cp .env.example .env
# Then update:
# - DATABASE_URL (if different)
# - JWT_SECRET (MUST be 32+ chars - see below)
# - NODE_ENV (development or production)
```

Generate strong JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### 2. Password Reset Required
All users must reset passwords due to hashing algorithm change:
```bash
# Manual approach: Ask users to use "Forgot Password" flow (if implemented)
# Or: Reset all users, send them reset links
```

#### 3. Update Client Code

Old login endpoint:
```javascript
POST /api/login
```

New login endpoint:
```javascript
POST /api/auth/login
```

Old profile endpoint:
```javascript
GET /api/profile
Authorization: Bearer <token>
```

New profile endpoint:
```javascript
GET /api/users/profile
Authorization: Bearer <token>
```

#### 4. Install & Start
```bash
npm install  # Gets bcrypt, joi, updated packages
npm run dev  # Development mode with auto-reload
```

### Security Migration Guide

#### For Database Administrators

1. **Backup current database** before upgrading
2. **Soft delete user passwords** - don't delete, just mark as "needs reset"
3. **Disable v1.0.0 server** to prevent token conflicts
4. **Deploy v2.0.0** with proper JWT_SECRET
5. **Send password reset emails** to all users

#### Example: Soft Delete Old Passwords
```javascript
// One-time script to run after deployment
db.users.updateMany({}, { $set: { passwordNeedsReset: true } })
```

Then on next login attempt:
```javascript
if (user.passwordNeedsReset) {
  throw new Error('Please reset your password')
}
```

### Files Removed
- `src/routes.js` (monolithic, replaced by modular routes/)

### Files Added
- `src/server.js` (new entry point)
- `src/app.js` (refactored, now just Express config)
- `src/config/db.js` (database connection)
- `src/controllers/` (auth, user, shipment)
- `src/services/` (auth, user, shipment business logic)
- `src/routes/` (auth, user, shipment route definitions)
- `src/middlewares/` (auth, validation, error, async-handler)
- `src/utils/` (errors, hash, jwt)
- `src/validators/` (auth, shipment Joi schemas)

### Files Modified
- `package.json` (version, dependencies, main entry)
- `models/User.js` (enhanced schema with validation)
- `models/Shipment.js` (enhanced schema with validation)
- `.env.example` (better documentation)
- `.gitignore` (added .env)
- `README.md` (complete rewrite for v2.0.0)

### Testing Checklist

- [ ] MongoDB connection succeeds with DATABASE_URL
- [ ] Server starts on PORT without crashing
- [ ] POST /api/auth/register creates user with bcrypt password
- [ ] POST /api/auth/login returns valid JWT token
- [ ] GET /api/users/profile with token returns current user
- [ ] GET /api/shipments returns user's shipments with populate()
- [ ] POST /api/shipments creates shipment with validated input
- [ ] Joi validation rejects invalid input (bad email, short password, etc.)
- [ ] DELETE/PATCH without admin role returns 403
- [ ] Unknown route returns 404
- [ ] Server errors return 500 with safe message

---

**Support**: See AUDIT.md for detailed code smell analysis that led to these changes.
