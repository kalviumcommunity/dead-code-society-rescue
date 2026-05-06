# Codebase Audit

## Summary
- Total smells found: 12
- Critical: 4 | High: 4 | Medium: 4

## Issues

| File | Issue | Severity | Explanation |
|------|-------|----------|-------------|
| src/routes.js | MD5 used for password hashing (before) | CRITICAL | MD5 is not a password hashing algorithm; it's fast and crackable. Replaced with bcrypt. |
| src/routes.js | Default weak JWT secret fallback | CRITICAL | `process.env.JWT_SECRET` had insecure default; tokens can be forged if env missing. |
| src/routes.js | N+1 query in shipments listing | CRITICAL | `User.findById` called inside loop for each shipment; replaced with `populate`. |
| src/routes.js | Delete route lacks ownership/admin check | CRITICAL | Any valid token can delete any shipment. Needs authorization check. |
| src/routes.js | Spreading `req.body` into models | HIGH | Directly spreading `req.body` allows NoSQL injection and unexpected fields. |
| src/routes.js | Repeated inline `jwt.verify` blocks | HIGH | Duplicated auth logic across routes; extract to middleware. |
| src/routes.js | Mixed responsibilities (routes + business logic + DB calls) | HIGH | Single large file doing routing, DB and auth. Needs MVC split. |
| src/app.js | Missing centralized error handler | MEDIUM | No global error middleware; duplicate try/catch in routes. |
| src/routes.js | Use of `var` and promise `.then()` chains | MEDIUM | Old JS style; convert to `const/let` and `async/await`. |
| models/User.js | Password comment suggests MD5 | MEDIUM | Schema comment refers to md5; misleading after migration. |
| src/routes.js | Hard-coded magic strings (statuses, tokens) | MEDIUM | Use enums/constants instead of raw literals. |
| src/routes.js | Unused imports and dead code blocks | MEDIUM | `path`, `fs`, `http` unused; large commented sections clutter. |

---

Notes:
- Immediate security fixes applied: replaced MD5 flows with bcrypt util, added auth middleware, fixed shipments N+1 with `populate`, updated `package.json` to include `bcrypt`.
- Next steps: finish tagging `// SMELL:` comments inline, refactor into MVC, add Joi validators, central error handler, update README and CHANGELOG.
