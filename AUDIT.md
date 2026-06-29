# Codebase Audit

## Summary
- Total smells found: 12
- Critical: 3 | High: 7 | Medium: 2

## Issues

| File | Issue | Severity | Explanation |
|------|-------|----------|-------------|
| src/routes.js | Direct spread on user registration body | HIGH | Direct spread of `req.body` allows mass assignment and NoSQL injection. |
| src/routes.js | MD5 password hashing during registration | CRITICAL | MD5 is not a secure password hashing algorithm and is vulnerable to pre-image and collision attacks (rainbow tables). |
| src/routes.js | Universal use of 200 HTTP status code | MEDIUM | Returns HTTP 200 even for errors and resource creations, violating RESTful API conventions. |
| src/routes.js | Direct query on email without sanitization | HIGH | User input is queried directly, opening the application to NoSQL injection. |
| src/routes.js | MD5 password comparison on login | CRITICAL | Plaintext MD5 comparison is insecure and does not use a timing-safe hashing function like bcrypt. |
| src/routes.js | Duplicate authentication block | HIGH | JWT verification is duplicated across almost all routes instead of being centralized in a reusable middleware. |
| src/routes.js | N+1 database queries | HIGH | Fetches user details by executing a query inside a loop for each shipment, causing poor database performance ($N+1$). |
| src/routes.js | Uncaught database query in loop | HIGH | Database query inside loop has no `.catch()` handler, leading to unhandled promise rejections. |
| src/routes.js | Direct spread on shipment creation | HIGH | Spreads `req.body` directly, causing a mass assignment vulnerability where users can inject fields. |
| src/routes.js | Missing permission checks on delete | CRITICAL | Any authenticated user can delete any shipment, leading to IDOR (Insecure Direct Object Reference). |
| src/routes.js | Missing catch block on profile endpoint | HIGH | Database call in `/profile` route does not handle query errors, which can crash the application. |
| src/routes.js | Dummy padding code | MEDIUM | Contains dead code (empty loops and comments) designed to inflate the codebase size artificially. |
