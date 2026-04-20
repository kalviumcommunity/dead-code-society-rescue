# Codebase Audit

## Summary

* Total smells found: 17
* Critical: 8
* High: 6
* Medium: 3

## Issues

| File | Issue | Severity | Explanation |
| --- | --- | --- | --- |
| package.json | Insecure crypto dependency | CRITICAL | MD5 is fundamentally broken and insecure for password hashing |
| src/app.js | Unsafe environment fallback | HIGH | Fallback DB URL masks missing config in production environments |
| src/app.js | Deprecated dependency usage | MEDIUM | body-parser is deprecated; Express has built-in JSON parsing |
| src/routes.js | Hardcoded JWT secret | CRITICAL | Fallback secret allows trivial token forgery if config is missing |
| src/routes.js | Mass assignment risk | CRITICAL | Spread operator on req.body allows injection of arbitrary database fields |
| src/routes.js | MD5 password hashing | CRITICAL | MD5 is easily crackable via rainbow tables and brute force |
| src/routes.js | Wrong HTTP status codes | HIGH | Returning 200 OK for API failures breaks REST principles |
| src/routes.js | NoSQL injection risk | CRITICAL | Unvalidated input in findOne enables MongoDB query operator injection |
| src/routes.js | Duplicated auth logic | HIGH | Missing centralized auth middleware creates inconsistent security checks |
| src/routes.js | N+1 queries | CRITICAL | Database queries inside a loop cause exponential performance degradation |
| src/routes.js | Predictable tracking IDs | MEDIUM | Custom random logic causes collisions and allows data scraping |
| src/routes.js | Magic strings | MEDIUM | Hardcoded status strings are error-prone; constants/enums are required |
| src/routes.js | Leaking raw DB errors | HIGH | Exposing internal Mongoose errors to the client leaks schema details |
| src/routes.js | Missing ownership authorization | CRITICAL | IDOR vulnerability allows any authenticated user to delete any shipment |
| src/routes.js | Unhandled Promise rejection | HIGH | Missing catch block causes hanging requests and resource leaks |
| models/User.js | Missing enum validation | MEDIUM | Role field accepts any string, bypassing role-based access control |
| models/Shipment.js | Missing enum validation | MEDIUM | Status field accepts invalid shipment states and typos |
