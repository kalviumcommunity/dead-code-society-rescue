# Codebase Audit

## Summary

- Total smells found: 13
- Critical: 5
- High: 6
- Medium: 2

## Issues

| File | Issue | Severity | Explanation |
|------|--------|----------|-------------|
| src/routes.js | Hardcoded JWT secret fallback | CRITICAL | Allows token forgery if environment variable is missing |
| src/routes.js | MD5 password hashing | CRITICAL | MD5 is broken and unsuitable for password storage |
| src/routes.js | MD5 password comparison | CRITICAL | Uses insecure password verification |
| src/routes.js | N+1 query problem | CRITICAL | Database query executed inside loop causing performance issues |
| src/routes.js | Missing authorization on delete | CRITICAL | Any authenticated user can delete any shipment |
| src/routes.js | Mass assignment via req.body spread | HIGH | Users can inject unexpected fields such as role |
| src/routes.js | No input validation | HIGH | Accepts untrusted user input without validation |
| src/routes.js | Authentication error leakage | HIGH | Reveals whether email or password is incorrect |
| src/routes.js | Duplicated auth logic | HIGH | Same JWT verification code repeated across routes |
| src/routes.js | Missing promise error handling | HIGH | Rejected promises may go unhandled |
| src/routes.js | Incorrect HTTP status usage | HIGH | Returns 200 for creation and error cases |
| src/routes.js | Unused imports | MEDIUM | Increases maintenance burden and code noise |
| src/routes.js | Dead code / padding loop | MEDIUM | Makes code harder to understand and maintain |