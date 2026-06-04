# Codebase Audit Report

## Summary
- **Total smells found**: 13
- **Critical**: 4 | **High**: 5 | **Medium**: 4

---

## Issues

| File | Issue | Severity | Explanation |
|------|-------|----------|-------------|
| src/routes.js | MD5 password hashing (register, login) | CRITICAL | MD5 is not a cryptographic hash algorithm. It's designed for checksums, not password storage. Rainbow tables can crack MD5 hashes in under a second. Must use bcrypt with 12+ rounds. |
| src/routes.js | NoSQL injection via spread operator | CRITICAL | Using `{...req.body}` in register route allows attackers to send arbitrary fields. Attacker can send `{"email":"a@b.com","password":"123","role":"admin"}` and bypass role validation. |
| src/routes.js | Authorization bypass in DELETE /shipments/:id | CRITICAL | No permission check before deleting shipments. Any authenticated user can delete ANY shipment, not just their own. An attacker can enumerate IDs and delete all shipments. |
| src/routes.js | N+1 query problem in GET /shipments | CRITICAL | Fetches user details inside a loop. If a user has 100 shipments, this executes 101 queries (1 + 100) instead of 2. Massive performance issue that scales poorly. Fix: Use Shipment.populate('userId'). |
| src/routes.js | Duplicated authentication code | HIGH | Auth block (token extract + JWT verify) is copied into every protected route. Violates DRY principle and makes changes hard to propagate. Extract into middleware. |
| src/routes.js | Using 'var' throughout codebase | HIGH | `var` has function scope and allows hoisting/shadowing. Use `const` by default (most variables), `let` only when reassigned. Makes code harder to reason about and introduces subtle bugs. |
| src/routes.js | Promise chains without .catch() blocks | HIGH | GET /profile route is missing .catch(). If database query fails, response is never sent and client hangs forever. Every promise needs error handling. |
| src/routes.js | Inconsistent HTTP status codes | HIGH | Using 200 for resource creation (should be 201 Created). Not following REST conventions. Makes API harder to consume for clients. |
| src/routes.js | No input validation | HIGH | Routes accept any data structure without validation. Attacker can send missing fields, wrong types, or malicious strings. Need validation library (Joi or Zod). |
| src/routes.js | Unused imports (path, fs, http, os) | MEDIUM | Adds unnecessary dependencies and confusion. Path, fs, http, and os are imported but never used. Bloats the module and creates mental overhead. |
| src/routes.js | Magic strings for status values | MEDIUM | Status field uses hardcoded strings like 'pending', 'delivered'. If you need to change them, search/replace is error-prone. Use status constants or enum. |
| src/routes.js | No centralized error handling | MEDIUM | Each route has its own try/catch or .catch(). Error formats are inconsistent (some return 200, some return json error). Hard to debug and maintain. Need middleware error handler. |
| src/routes.js | Callback hell and missing async/await | MEDIUM | Promise chains are nested and hard to read. JWT verification uses callback inside promise. Should use async/await at function level for clarity and easier error handling. |

---

## Severity Breakdown

**CRITICAL (4)** — Must fix before shipping. These are security and major performance issues:
- MD5 hashing for passwords
- NoSQL injection vulnerability
- Authorization bypass vulnerability
- N+1 query performance issue

**HIGH (5)** — Fix to improve code quality and maintainability:
- Duplicated auth code
- Using 'var' instead of const/let
- Missing error handling (.catch blocks)
- Inconsistent HTTP status codes
- No input validation

**MEDIUM (4)** — Quality improvements that help future developers:
- Unused imports clutter the code
- Magic strings hard-code business logic
- No centralized error handling makes debugging harder
- Callback hell makes code hard to follow

---

## Next Steps (In Order of Priority)

1. **Security First**: Replace MD5 with bcrypt, fix auth bypass, add input validation
2. **Restructure**: Move from flat routes.js into MVC (controllers, services, middlewares)
3. **Code Quality**: Replace var, rewrite promises as async/await
4. **Performance**: Fix N+1 query with populate()
5. **Maintainability**: Add JSDoc, centralized error handling, README + CHANGELOG

All // SMELL: comments will be removed after each issue is fixed.
