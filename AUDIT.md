# Codebase Audit
 
## Summary
- Total smells found: 12
- Critical: 4 | High: 4 | Medium: 4
 
## Issues
 
| File | Issue | Severity | Explanation |
|------|-------|----------|-------------|
| src/routes.js | MD5 password hashing during registration | CRITICAL | MD5 is mathematically broken, lacks salt, and is instantly crackable via rainbow tables. |
| src/routes.js | MD5 password verification on login | CRITICAL | Comparing plain MD5 hashes of passwords is insecure. |
| src/routes.js | N+1 database queries in GET /shipments | CRITICAL | Initiates database queries in a loop for each shipment, resulting in terrible performance overhead. |
| src/routes.js | Missing ownership checks on DELETE /shipments/:id | CRITICAL | Missing access control allows any authenticated user to delete any shipment by ID. |
| src/routes.js | Mass assignment / NoSQL injection on registration | HIGH | Directly spreading req.body allows clients to overwrite database fields like role (e.g. role: 'admin'). |
| src/routes.js | Direct query injection on login | HIGH | Querying User.findOne directly with req.body.email without validation makes it vulnerable to NoSQL Injection. |
| src/routes.js | Duplicated auth block logic | HIGH | Auth token parsing and verification is repeated in every protected route instead of utilizing middleware. |
| src/routes.js | Unhandled Promise Rejection on GET /profile | HIGH | Promise chain lacks a catch handler, which can cause the process to crash on DB failures. |
| src/routes.js | Generic 200 OK status codes on errors | MEDIUM | Errors return success: false with 200 OK status codes instead of proper HTTP error codes. |
| src/routes.js | Unused package imports | MEDIUM | Imports like path, fs, and http are declared but never used in the file. |
| src/routes.js | Silent database failure in GET /shipments loop | MEDIUM | Missing error handling catch block on User.findById inside the N+1 loop can lead to silent errors. |
| src/routes.js | Magic string comparison for status update | MEDIUM | Direct comparison with hardcoded 'delivered' status string should use models/constants. |
