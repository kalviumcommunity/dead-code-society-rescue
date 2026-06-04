# Codebase Audit

## Summary
- Total smells found: 12
- Critical: 4 | High: 4 | Medium: 4

## Issues

| File | Issue | Severity | Explanation |
|------|-------|----------|-------------|
| src/routes.js | MD5 used for password hashing | CRITICAL | MD5 is a fast general-purpose hash, not a password hashing algorithm, so captured hashes can be cracked quickly. |
| src/routes.js | `req.body` is spread directly into model creation | CRITICAL | Unsanitized attacker-controlled input can introduce NoSQL injection or unwanted fields. |
| src/routes.js | JWT auth block duplicated in every protected route | HIGH | Repeated verification logic is hard to maintain and easy to get wrong when auth rules change. |
| src/routes.js | N+1 query pattern in shipment listing | HIGH | The code performs a database lookup inside a loop, causing unnecessary round trips as result size grows. |
| src/routes.js | Promise chains without centralized error handling | HIGH | Several handlers rely on inline `.then()` chains and missing catches, so failures can be swallowed or handled inconsistently. |
| src/routes.js | Uses `var` throughout | MEDIUM | Function-scoped `var` increases hoisting-related bugs and makes the code harder to reason about. |
| src/routes.js | Unused imports are present | MEDIUM | Extra dependencies and imports add noise and hide what the file actually depends on. |
| src/routes.js | Magic strings are used for status and role checks | MEDIUM | Inline strings like `pending` and `admin` are easy to mistype and hard to update consistently. |
| src/app.js | App bootstrap, DB connection, and routing live together | HIGH | The entry file mixes multiple responsibilities, making startup and testing harder to isolate. |
| models/User.js | Password field is documented as MD5-based storage | CRITICAL | The schema and comments reinforce insecure password handling instead of a proper hashing strategy. |
| package.json | `md5` is installed as a runtime dependency | CRITICAL | Keeping a password-hashing library in the dependency tree normalizes insecure password storage. |
| .gitignore | `.env` is not ignored | HIGH | If the repo is shared, environment secrets can be committed accidentally and exposed. |

## Notes
- The highest-risk problems are password handling, direct body spreading, and duplicated auth logic.
- The shipment listing route also needs a data-access rewrite to remove the looped lookup pattern.
