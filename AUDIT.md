# Codebase Audit
 
## Summary
- Total smells found: 11
- Critical: 5 | High: 2 | Medium: 4
 
## Issues
 
| File | Issue | Severity | Explanation |
|------|-------|----------|-------------|
| src/routes.js | MD5 password hashing | CRITICAL | MD5 is not a password algorithm; it's instantly crackable. Use bcrypt or Argon2 instead. |
| src/routes.js | Hardcoded JWT secret | CRITICAL | JWT_SECRET is hardcoded in source code. Must be loaded from environment variable for security. |
| src/routes.js | No input validation on registration | CRITICAL | Spread operator on req.body allows NoSQL injection and malicious input. Implement validation to sanitize and whitelist expected fields. |
| src/routes.js | No input validation on login | CRITICAL | Direct use of req.body.email without validation allows NoSQL injection attacks. Implement input validation. |
| src/routes.js | Repeated authentication code | CRITICAL | Authentication logic duplicated in every route handler. Refactor into middleware function for maintainability and consistency. |
| src/app.js | Hardcoded MongoDB connection string | HIGH | mongoUrl is undefined/hardcoded. Must use environment variable (process.env.MONGO_URL) to avoid exposing credentials in source code. |
| src/routes.js | Incorrect HTTP status codes on error | HIGH | Using 200 status code even on registration/login failure. Use appropriate codes (400 for bad request, 401 for unauthorized, 500 for server error). |
| src/app.js | Deprecated body-parser dependency | MEDIUM | body-parser is deprecated. Use built-in express.json() and express.urlencoded() instead. |
| src/routes.js | Unused imports | MEDIUM | Unused imports: path, fs, http, os. Remove to clean up code and reduce bundle size. |
| models/User.js | Missing enum constraint on role field | MEDIUM | Role field should have enum: ['user', 'admin'] to enforce valid values and prevent invalid data. |
| models/Shipment.js | Missing enum constraint on status field | MEDIUM | Status field should have enum: ['pending', 'in-progress', 'delivered', 'cancelled'] to enforce valid values and prevent invalid data. |