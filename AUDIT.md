# Codebase Audit

## Summary
- Total smells found: 22
- Critical: 7 | High: 8 | Medium: 7

## Issues

| File | Issue | Severity | Explanation |
|------|-------|----------|-------------|
| src/routes.js | MD5 used for password hashing | CRITICAL | MD5 is a general-purpose hash, not a password hashing algorithm. Rainbow tables can crack MD5-hashed passwords instantly. |
| src/routes.js | No input validation on req.body | CRITICAL | Raw req.body is spread directly into database operations, enabling NoSQL injection attacks. An attacker can send {"$gt": ""} to bypass authentication. |
| src/routes.js | req.body spread in shipment creation | CRITICAL | Spreading req.body allows attackers to send extra fields like {role: 'admin'} to escalate privileges. |
| src/routes.js | MD5 password comparison | CRITICAL | Comparing MD5 hashes is insecure. Should use bcrypt.compare() for secure password verification. |
| models/User.js | MD5 comment indicates insecure hashing | CRITICAL | Comment acknowledges MD5 usage for passwords, which is fundamentally insecure. |
| .gitignore | .env not listed | CRITICAL | If this repo is public, secrets (DATABASE_URL, JWT_SECRET) would be exposed to attackers. |
| src/routes.js | Duplicate JWT verification blocks | HIGH | JWT verification code is repeated 4+ times inline. Should be extracted into a middleware function. |
| src/routes.js | N+1 query problem | HIGH | Fetching user details inside a loop makes 1+N database queries. For 100 shipments, this triggers 101 DB round trips. |
| src/routes.js | Database query inside loop | HIGH | User.findById() called inside a for loop - classic N+1 anti-pattern causing severe performance issues. |
| src/routes.js | Missing .catch() on promises | HIGH | Silent failures when promises reject without error handlers, leading to corrupted state. |
| src/routes.js | Missing authorization check on delete | HIGH | Any authenticated user can delete any shipment regardless of ownership. |
| src/routes.js | Missing .catch() on profile route | HIGH | User.findById() has no error handler - silent failures. |
| src/routes.js | Promise chains instead of async/await | HIGH | Nested .then() chains reduce readability and make error handling difficult. |
| src/routes.js | var used throughout | HIGH | var causes function-scoped hoisting bugs. Should use const/let for block scoping. |
| src/app.js | var used throughout | HIGH | var causes function-scoped hoisting bugs. Should use const/let for block scoping. |
| models/User.js | var used throughout | HIGH | var causes function-scoped hoisting bugs. Should use const/let for block scoping. |
| models/Shipment.js | var used throughout | HIGH | var causes function-scoped hoisting bugs. Should use const/let for block scoping. |
| src/routes.js | Wrong HTTP status codes | MEDIUM | Using 200 for all responses. Should use proper codes (201 for created, 404 for not found, etc.). |
| src/routes.js | Magic strings | MEDIUM | Status values like 'pending', 'delivered' are hardcoded. Should use constants or enums. |
| src/routes.js | Dead code - commented functions | MEDIUM | Commented-out old code adds noise and slows down readers. |
| src/routes.js | Dead code - padding loop | MEDIUM | Useless for loop and comments that add no value. |
| src/routes.js | Unused imports | MEDIUM | path, fs, http are imported but never used. |
| src/app.js | Deprecated Mongoose options | MEDIUM | useCreateIndex and useFindAndModify are deprecated in newer Mongoose versions. |
| src/app.js | No 404 handler | MEDIUM | Express default 404 sends HTML, not JSON. API should have consistent JSON responses. |
| models/User.js | Magic string for role | MEDIUM | 'user' and 'admin' are hardcoded. Should use constants. |
| models/Shipment.js | Magic string for status | MEDIUM | Status values are hardcoded. Should use constants. |
| README.md | Incomplete setup documentation | MEDIUM | README doesn't explain environment setup, required variables, or how to configure the database. |
