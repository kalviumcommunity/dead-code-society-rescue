# Codebase Audit

## Summary
- Total smells found: 10
- Critical: 2 | High: 4 | Medium: 4

## Issues

| File | Issue | Severity | Explanation |
|------|-------|----------|-------------|
| src/routes.js | MD5 password hashing | CRITICAL | Not a password hashing algorithm; easily cracked. |
| src/routes.js | N+1 query inside loop | CRITICAL | Database query per shipment causes severe performance issues. |
| src/routes.js | No ownership check on delete | HIGH | Any authenticated user can delete any shipment. |
| src/routes.js | No input validation on login/register | HIGH | Missing validation allows malformed or malicious payloads. |
| src/routes.js | Unsafe object spread into model | HIGH | Directly spreading req.body allows NoSQL injection and extra fields. |
| src/routes.js | Duplicate inline auth logic | MEDIUM | Repeated auth blocks make the code hard to maintain and insecure. |
| src/routes.js | Missing error handling on profile lookup | MEDIUM | Uncaught database error could crash the request. |
| src/routes.js | HTTP 200 used for all responses | MEDIUM | Success status codes are used even for failures, hiding API contract. |
| src/routes.js | Unused imports and dead code | MEDIUM | `path`, `fs`, `http`, `os` are imported but not all used, increasing noise. |
| models/User.js | MD5 comment and password field risk | MEDIUM | Comment admits insecure hashing; model should not document unsafe behavior. |
