# Codebase Audit

## Summary
- Total smells found: 16
- Critical: 5 | High: 6 | Medium: 5

## Issues

| File | Issue | Severity | Explanation |
|------|------|----------|------------|
| routes.js | MD5 password hashing | CRITICAL | MD5 is insecure and easily crackable |
| routes.js | No input validation | CRITICAL | Allows malicious payloads and injection |
| routes.js | Spread operator on req.body | CRITICAL | Enables mass assignment (user can set role=admin) |
| routes.js | No authorization on delete | CRITICAL | Any user can delete any shipment |
| routes.js | Hardcoded JWT fallback | CRITICAL | Weak secret used if env missing |
| routes.js | Duplicate auth logic | HIGH | JWT verification repeated in multiple routes |
| routes.js | N+1 query problem | HIGH | Fetching user inside loop causes excessive DB calls |
| routes.js | Returning full user object | HIGH | Exposes sensitive data like password hash |
| routes.js | No HTTP status codes | HIGH | Always returns 200, breaks API semantics |
| routes.js | Unhandled promises | HIGH | Missing .catch() leads to silent failures |
| routes.js | Callback / promise chains | HIGH | Hard to read and maintain |
| app.js | var usage | MEDIUM | Outdated, function-scoped bugs |
| routes.js | Unused imports | MEDIUM | Dead code increases confusion |
| routes.js | Magic strings | MEDIUM | Hardcoded values reduce maintainability |
| routes.js | Dead commented code | MEDIUM | Clutters codebase |
| models | Manual timestamps | MEDIUM | Reinventing built-in Mongoose feature |