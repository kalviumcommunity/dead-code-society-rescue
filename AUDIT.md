# Codebase Audit

## Summary
- Total smells found: 14
- Critical: 2 | High: 7 | Medium: 5

## Issues Found

| File | Issue | Severity |
|------|-------|----------|
| src/routes.js | MD5 used for password hashing (rainbow table crackable in seconds) | CRITICAL |
| src/routes.js | Raw req.body passed directly to DB (NoSQL injection vulnerability) | CRITICAL |
| src/routes.js | Massive 600+ line God File handling routing, logic, DB queries simultaneously | HIGH |
| src/routes.js | Duplicate JWT verification blocks copied 6+ times (DRY violation) | HIGH |
| src/routes.js | N+1 database queries in shipment listing loop (101 queries for 100 shipments) | HIGH |
| src/routes.js | Missing error handling on promise chains (silent failures) | HIGH |
| src/routes.js | Weak JWT secret fallback ('secret123') - not enforced minimum length | HIGH |
| src/routes.js | Inconsistent HTTP status codes (always 200 for errors) | HIGH |
| src/routes.js | No input validation on any endpoint (type, length, format) | HIGH |
| src/app.js | var keyword used throughout (function-scope hoisting bugs) | MEDIUM |
| src/routes.js | Unused imports (path, fs, http, os, mongoose) creating dead code | MEDIUM |
| src/routes.js | Magic strings for status values ('pending', 'delivered') scattered throughout | MEDIUM |
| src/routes.js | Commented-out old code left behind (routes, test endpoints) | MEDIUM |
| .gitignore | .env not listed (secrets exposed if repo goes public) | MEDIUM |

## Code Smell Categories Identified

### Security Vulnerabilities
- MD5 password hashing allows instant cracking via rainbow tables
- NoSQL injection via unvalidated req.body spread operator
- Weak JWT secret not enforced
- .env file not in .gitignore

### Architecture Issues
- Single 600+ line monolithic routes.js (God File)
- No separation of concerns (routing, business logic, DB queries mixed)
- Duplicate authentication blocks (copy-paste code)
- No centralized error handling

### Code Quality
- Promise chains without proper error handling
- var instead of const/let throughout
- Unused imports and dead code
- Magic numbers and strings
- Missing input validation

### Performance
- N+1 query problem in shipment listing (fetches user for each shipment in loop)

## Remediation
All issues have been fixed in the refactored MVC codebase:
- ✅ bcrypt (12 rounds) replaces MD5
- ✅ Joi validation on all inputs + sanitization
- ✅ MVC architecture (routes → controllers → services → models)
- ✅ Reusable auth middleware
- ✅ Centralized error handling
- ✅ populate() and aggregation fix N+1
- ✅ async/await replaces promise chains
- ✅ const/let throughout
- ✅ JSDoc on all exports
- ✅ .env in .gitignore