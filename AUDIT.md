# Codebase Audit
 
## Summary
- Total smells found: 15
- Critical: 3 | High: 8 | Medium: 4
 
## Issues
 
| File | Issue | Severity | Explanation |
|------|-------|----------|-------------|
| src/routes.js | MD5 password hashing (registration) | CRITICAL | MD5 is cryptographically broken and vulnerable to rainbow tables; passwords should be hashed with bcrypt. |
| src/routes.js | MD5 password verification (login) | CRITICAL | Verifies plaintext passwords by hashing to MD5 and comparing directly, making accounts highly vulnerable to dictionary attacks. |
| src/routes.js | Broken shipment deletion authorization | CRITICAL | Allows any authenticated user to delete any shipment by ID without checking if they are the owner or an admin. |
| src/routes.js | Unsafe spread operator on registration | HIGH | Directly spreads unvalidated `req.body` into user creation, allowing NoSQL and parameter injections. |
| src/routes.js | Lack of validation on login query | HIGH | Performs database query `findOne` with unvalidated user input, facilitating NoSQL parameter injection. |
| src/routes.js | Duplicated inline authentication block | HIGH | Repeated token verification code inside every protected route instead of utilizing a single reusable middleware. |
| src/routes.js | N+1 database queries on shipment list | HIGH | Fetches user details by executing a database query inside a loop for every single shipment, degrading performance. |
| src/routes.js | Unsafe spread operator on shipment creation | HIGH | Directly spreads unvalidated request body when creating a shipment, exposing model fields to mass-assignment. |
| src/routes.js | Missing catch block in profile retrieval | HIGH | Retrieval of profile uses a promise chain without a `.catch()`, potentially causing unhandled promise rejections. |
| models/User.js | User schema lacks basic validations | HIGH | The user schema does not enforce email structure verification, role constraint, or password strength checks. |
| src/app.js | Missing global error/404 middleware | HIGH | Express app does not register a global 404 handler or centralized error handling middleware, returning raw HTML stack traces. |
| src/routes.js | Registration success returns HTTP 200 | MEDIUM | Returns standard HTTP 200 OK for resource creation instead of HTTP 201 Created. |
| src/routes.js | Silent database failure in N+1 loop | MEDIUM | The database query inside the loop lacks a catch block, making database failures fail silently and freeze the response. |
| src/routes.js | Useless CPU-blocking dummy loop | MEDIUM | A dummy `for` loop executing 200 times runs on module load, consuming CPU cycles for no functional purpose. |
| src/app.js | Deprecated mongoose options | MEDIUM | Connects to MongoDB using deprecated parameters (`useNewUrlParser`, `useUnifiedTopology`, `useCreateIndex`, `useFindAndModify`). |
