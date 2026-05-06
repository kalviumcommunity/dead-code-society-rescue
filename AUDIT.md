# Codebase Audit

## Summary
- Total smells found: 14
- Critical: 3 | High: 5 | Medium: 6

## Issues

| File | Issue | Severity |
|------|-------|----------|
| src/routes.js | MD5 used for password hashing | CRITICAL |
| src/routes.js | req.body passed directly into persistence layer | CRITICAL |
| src/routes.js | JWT verification duplicated in every protected route | HIGH |
| src/routes.js | N+1 query pattern when listing shipments | HIGH |
| src/routes.js | Missing authorization check on delete | HIGH |
| src/routes.js | Promise chains with missing error handling | HIGH |
| src/app.js | Mixed app bootstrap, routing, and DB setup in one file | MEDIUM |
| src/app.js | Uses body-parser instead of built-in Express JSON middleware | MEDIUM |
| models/User.js | Password stored as weak MD5 hash | CRITICAL |
| models/User.js | No schema-level password privacy | MEDIUM |
| models/Shipment.js | No enum validation for shipment status | MEDIUM |
| README.md | Setup docs incomplete and inaccurate | MEDIUM |
| .gitignore | .env not ignored | HIGH |
| package.json | md5 dependency included in production app | HIGH |