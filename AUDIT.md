# Codebase Audit

## Summary
- Total smells found: 16
- Critical: 4 | High: 7 | Medium: 5

## Issues

| File | Issue | Severity | Explanation |
|------|-------|----------|-------------|
| src/routes.js | MD5 password hashing | CRITICAL | MD5 is fast and crackable; unsuitable for password storage |
| src/routes.js | Raw `req.body` spread into DB payload | CRITICAL | Allows NoSQL injection and privilege escalation via extra fields |
| src/routes.js | No body validation on auth/shipment routes | CRITICAL | Untrusted input reaches DB and auth logic directly |
| src/routes.js | Repeated inline JWT verification blocks | HIGH | Duplicated auth logic increases drift and bug risk |
| src/routes.js | N+1 query in shipment listing | HIGH | One query per shipment for user details degrades performance |
| src/routes.js | Missing catch block in profile route | HIGH | Promise rejection can fail silently and skip proper response |
| src/routes.js | Delete shipment missing ownership check | CRITICAL | Any authenticated user could delete any shipment |
| src/routes.js | Extensive unused imports (`path`, `fs`, `http`) | MEDIUM | Dead code increases maintenance and cognitive load |
| src/routes.js | Mixed responsibilities in one god file | HIGH | Routing, business logic, DB, and auth are tightly coupled |
| src/routes.js | Magic strings for status/role checks | MEDIUM | Hard-coded values reduce clarity and consistency |
| src/routes.js | Promise chains with nested callbacks | HIGH | Hard to read, hard to reason about errors |
| src/app.js | `var` usage across bootstrap | MEDIUM | Function-scoped variables are error-prone and outdated |
| src/app.js | Manual model loading side effects | MEDIUM | Hidden initialization dependencies reduce modularity |
| .gitignore | `.env` not ignored | HIGH | Secrets can be committed accidentally |
| README.md | Missing environment variable and setup details | MEDIUM | New contributors cannot reliably run project quickly |
| models/User.js | Weak schema constraints | MEDIUM | Email/name/password quality checks were insufficient |
