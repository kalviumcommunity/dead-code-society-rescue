# Codebase Audit

| File | Issue | Severity | Explanation |
|------|-------|---------:|-------------|
| src/utils/hash.util.js | MD5 password hashing | CRITICAL | Passwords were hashed/stored using MD5; replaced with bcrypt (12 salt rounds). |
| src/utils/jwt.util.js | Hardcoded JWT secret | CRITICAL | JWT secret was hardcoded in code; now loaded from `process.env.JWT_SECRET`. |
| src/validators/auth.validators.js | Missing input validation on registration/login | CRITICAL | Registration/login lacked Joi validation; added schemas to validate inputs and strip unknown fields. |
| src/controllers/auth.controller.js | Repeated authentication code | CRITICAL | Authentication logic duplicated across controllers; centralized into `src/middlewares/auth.middleware.js`. |
| src/app.js | Hardcoded MongoDB connection | HIGH | Connection string was hardcoded; now uses `process.env.DATABASE_URL` with a localhost fallback. |
| src/middlewares/error.middleware.js | Incorrect HTTP status codes | HIGH | Handlers returned inconsistent status codes; standardized via custom error classes and centralized error handler. |
| package.json / src/app.js | Deprecated body-parser usage | MEDIUM | Project referenced `body-parser`; switched to built-in `express.json()` to remove the dependency. |
| src/routes/index.js | Unused imports | MEDIUM | Removed unused module imports from route files to reduce noise and potential side effects. |
| src/models/User.js | Missing role enum constraint | MEDIUM | `role` field lacked an enum constraint; added `enum: ['user','admin']` to validate values. |
| src/models/Shipment.js | Missing status enum constraint | MEDIUM | `status` field lacked an enum; added allowed values (`pending`, `in-progress`, `delivered`, `cancelled`). |
