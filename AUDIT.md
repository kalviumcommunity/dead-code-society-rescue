# Codebase Audit

## Summary
- Total smells found: 15
- Critical: 5
- High: 5
- Medium: 5

## Issues

| File | Issue | Severity | Explanation |
|------|-------|----------|-------------|
| src/routes.js | MD5 password hashing | CRITICAL | Easily crackable |
| src/routes.js | No input validation | CRITICAL | Enables NoSQL injection |
| src/routes.js | Hardcoded JWT fallback | HIGH | Unsafe in production |
| src/routes.js | Repeated JWT auth blocks | MEDIUM | Violates DRY principle |
| src/routes.js | N+1 query problem | HIGH | DB queries inside loops |
| src/routes.js | Missing authorization check | CRITICAL | Any user can delete shipments |
| src/routes.js | Promise chains | HIGH | Hard to maintain |
| src/routes.js | Dead code | MEDIUM | Reduces readability |
| src/routes.js | Unused imports | MEDIUM | Unnecessary code |
| src/routes.js | var usage | MEDIUM | Hoisting/scope issues |