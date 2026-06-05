# Codebase Audit

## Summary

- Total smells found: 16
- Critical: 5
- High: 7
- Medium: 4

## Issues

| File | Issue | Severity | Explanation |
|------|---------|----------|-------------|
| src/routes.js | MD5 password hashing | CRITICAL | MD5 is not secure for passwords |
| src/routes.js | No input validation | CRITICAL | NoSQL injection possible |
| src/routes.js | Direct req.body spread | CRITICAL | Attacker can inject unexpected fields |
| src/routes.js | Hardcoded JWT secret fallback | CRITICAL | Weak secret exposes authentication |
| src/routes.js | Missing authorization check on delete | CRITICAL | Any authenticated user can delete shipments |
| src/routes.js | Repeated JWT verification block | HIGH | Duplicate code |
| src/routes.js | N+1 query problem | HIGH | DB query inside loop |
| src/routes.js | Silent promise failures | HIGH | Missing catch blocks |
| src/routes.js | God file | HIGH | Routing, business logic and DB logic mixed together |
| src/routes.js | Promise chains instead of async/await | HIGH | Hard to maintain |
| src/routes.js | Unused imports | MEDIUM | path, fs, http imported but unused |
| src/routes.js | var used everywhere | MEDIUM | Hoisting issues |
| src/routes.js | Magic strings | MEDIUM | "pending", "delivered", "admin" |
| src/routes.js | Dead code blocks | MEDIUM | Commented-out routes |
| .gitignore | Missing .env entry | HIGH | Secrets could be committed |
| README.md | Incomplete setup instructions | MEDIUM | Difficult onboarding |