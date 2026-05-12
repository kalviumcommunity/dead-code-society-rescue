# Codebase Audit

## Summary
- Total smells found: 13
- Critical: 5 | High: 4 | Medium: 4

## Issues

| File | Issue | Severity | Explanation |
|------|-------|----------|-------------|
| src/routes.js | Hardcoded JWT secret | CRITICAL | Default JWT secret 'secret123' is publicly visible and easily guessable, compromising all authentication tokens. |
| src/routes.js | NoSQL injection in register | CRITICAL | Spread operator directly copies untrusted user input into database object, enabling NoSQL injection and schema pollution attacks. |
| src/routes.js | MD5 password hashing | CRITICAL | MD5 is cryptographically broken and not designed for password hashing; rainbow tables can crack any MD5 hash in under a second. |
| src/routes.js | NoSQL injection in shipment creation | CRITICAL | Spread operator copies untrusted user input into Shipment data, allowing attackers to inject malicious fields or modify unauthorized attributes. |
| src/routes.js | Missing authorization check on DELETE | CRITICAL | Any authenticated user can delete any shipment regardless of ownership, enabling unauthorized data destruction and privilege escalation. |
| src/routes.js | N+1 database queries | HIGH | Fetching user details for each shipment in a loop causes quadratic database load; a shipment list would trigger 1+N queries causing severe performance degradation. |
| src/routes.js | Weak tracking ID generation | HIGH | Tracking IDs use Date.now() and Math.random() which are predictable and not cryptographically secure, risking ID collisions and forgery. |
| src/routes.js | Missing error handling in /profile | HIGH | Promise chain lacks catch handler, causing unhandled rejections that hide database errors and leave client requests hanging indefinitely. |
| src/routes.js | Silent failure in nested promise | HIGH | User lookup in shipment loop has no catch block, silently swallowing errors and leaving the response pending forever if the query fails. |
| src/routes.js | Magic string comparisons | MEDIUM | Status values like 'delivered' and 'pending' are hardcoded throughout the codebase, making refactoring error-prone and reducing maintainability. |
| src/routes.js | Unused imports | MEDIUM | Imports for path, fs, http, and os clutter the namespace and suggest incomplete or dead code that should be removed or properly used. |
| src/app.js | Deprecated Mongoose options | MEDIUM | Options useCreateIndex and useFindAndModify are ignored in current Mongoose versions and will cause warnings or errors in future releases. |
| src/app.js | Missing error handler middleware | MEDIUM | No 404 or global error handler allows unhandled errors to crash the server and returns generic HTML instead of JSON responses for missing routes. |
