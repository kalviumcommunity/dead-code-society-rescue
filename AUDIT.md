# Codebase Audit

## Summary
- Total smells found: 12
- Critical: 3 | High: 4 | Medium: 5

## Issues

| File | Issue | Severity | Explanation |
|------|-------|----------|-------------|
| src/routes.js | MD5 password hashing | CRITICAL | MD5 is not a password hashing algorithm; easily cracked via rainbow tables. |
| src/routes.js | Spreading `req.body` into models | CRITICAL | Allows NoSQL injection and unexpected fields to be persisted. |
| src/routes.js | Hardcoded JWT secret fallback | HIGH | Using a hardcoded secret is insecure and may expose tokens if committed. |
| src/routes.js | N+1 queries in shipments listing | HIGH | Fetching user for each shipment inside a loop causes many DB round-trips. |
| src/routes.js | No input validation on endpoints | HIGH | Missing Joi/Zod validation allows attacker-controlled payloads. |
| src/routes.js | No permission check on delete | HIGH | Any authenticated user can delete any shipment. |
| src/routes.js | Using `var` everywhere | MEDIUM | `var` causes hoisting and scoping bugs; prefer `const`/`let`. |
| src/routes.js | Missing .catch() on some promises | MEDIUM | Silent failures when DB calls reject lead to inconsistent behaviour. |
| src/routes.js | Returns 200 on resource creation | MEDIUM | Should return 201 for created resources. |
| src/routes.js | No rate-limiting on auth routes | MEDIUM | Brute-force risk on login endpoint. |
| src/routes.js | Unused imports (path/fs/http) | LOW | Noise that confuses maintainers. |
| src/routes.js | God file: routing + logic + DB | MEDIUM | File mixes routing, validation, business logic and DB access.

