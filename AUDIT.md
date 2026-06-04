# Codebase Audit

## Summary
- Total smells found: 10
- Critical: 3 | High: 4 | Medium: 3

## Issues

| File | Issue | Severity | Explanation |
|------|-------|----------|-------------|
| src/routes.js | MD5 password hashing | CRITICAL | MD5 is not a password hashing algorithm; a rainbow table can crack it instantly. |
| src/routes.js | req.body spread into DB | CRITICAL | No input validation. Unrestricted data flows straight to the database leading to NoSQL Injection. |
| src/routes.js | user.password === md5() | CRITICAL | Manual plaintext-to-MD5 comparison for passwords is highly insecure. |
| src/routes.js | DB calls in routes | HIGH | God file anti-pattern: routing, processing, and database calls all happen in `routes.js`. |
| src/routes.js | Multiple DB queries in loop | HIGH | N+1 Query Problem: `User.findById(ship.userId)` is inside a loop, taking O(N) operations. |
| src/routes.js | Missing .catch on DB find | HIGH | Callback hell / Unhandled Promise. Silent failures can leave requests hanging. |
| src/routes.js | Inline authorization | MEDIUM | Duplicate code. The JWT auth logic is strictly copy-pasted in multiple routes instead of extracted as middleware. |
| src/routes.js | `var` keyword everywhere | MEDIUM | Variable hoisting and scoping issues. Needs to be migrated to block-scoped `const/let`. |
| src/routes.js | Unused module imports | MEDIUM | Dead code. Imports like `path` and `fs` are imported but never used. |
| src/routes.js | 'pending' magic string | MEDIUM | Magic strings shouldn't be hardcoded into functions. |
