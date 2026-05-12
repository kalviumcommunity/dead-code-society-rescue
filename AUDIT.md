# Codebase Audit: LogiTrack Backend

**Date:** May 12, 2026  
**Auditor:** Code Rescue Team  
**Status:** Pre-Restructure Audit

## Summary

- **Total smells found:** 16
- **Critical:** 6 | **High:** 7 | **Medium:** 3

---

## Issues

| File           | Issue                                         | Severity | Explanation                                                                                                                                                        |
| -------------- | --------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| models/User.js | MD5 password hashing                          | CRITICAL | MD5 is not a password hashing algorithm. Rainbow tables can crack MD5 hashes in under a second. Must use bcrypt with minimum 12 rounds.                            |
| src/routes.js  | NoSQL injection in /register                  | CRITICAL | Spread operator (`...req.body`) accepts arbitrary fields. Attacker can inject MongoDB operators ($gt, $where, etc.) or set admin flags.                            |
| src/routes.js  | NoSQL injection in /login                     | CRITICAL | Email query accepts arbitrary input without validation. Possible NoSQL operator injection.                                                                         |
| src/routes.js  | NoSQL injection in /shipments POST            | CRITICAL | Spread operator in Shipment creation allows injection of system fields like createdAt, updatedAt.                                                                  |
| src/routes.js  | Authorization bypass in DELETE /shipments/:id | CRITICAL | No permission check before deletion. Any authenticated user can delete any shipment belonging to anyone else.                                                      |
| src/routes.js  | Weak JWT secret default                       | HIGH     | Default JWT_SECRET is 'secret123'. Easily guessable. If env var missing, defaults to predictable value.                                                            |
| src/routes.js  | N+1 query problem in GET /shipments           | HIGH     | Fetches user details for each shipment inside a loop. 1 query to fetch shipments + N queries for N shipments = N+1 total. Scales poorly. Should use `.populate()`. |
| src/routes.js  | Missing .catch() in GET /profile              | HIGH     | Promise rejection unhandled. If findById fails, response never sent. Request hangs indefinitely.                                                                   |
| src/routes.js  | Auth logic duplicated across routes           | HIGH     | Same 7-line authentication block repeated in 5+ routes. Violates DRY principle. Should be middleware.                                                              |
| src/routes.js  | Unused imports (path, fs, http, os)           | MEDIUM   | Imported but used only in /status route for reading system info. Should be removed or moved to separate module.                                                    |
| src/routes.js  | Magic strings for status values               | MEDIUM   | Status values ('pending', 'in-progress', 'delivered', 'cancelled') hardcoded in multiple places. No type safety or documentation. Should use enum or constants.    |
| src/routes.js  | Inconsistent HTTP status codes                | MEDIUM   | Returns 200 (OK) for all successful responses. Should use 201 (Created) for POST, 400 for validation errors, 409 for conflicts.                                    |
| src/app.js     | Using var throughout                          | HIGH     | All imports use `var` instead of `const`. Should use `const` for all immutable bindings.                                                                           |
| src/routes.js  | Using var throughout                          | HIGH     | All variables declared with `var`. Should use `const` (immutable) or `let` (scoped) based on reassignment.                                                         |
| models/User.js | Using var throughout                          | HIGH     | All imports use `var`. Should use `const`.                                                                                                                         |
| src/app.js     | Promise chains instead of async/await         | HIGH     | Database connection uses .then()/.catch(). Should use async/await for readability and maintainability.                                                             |

---

## Security Risk Summary

**CRITICAL (Fix immediately):**

- MD5 passwords can be cracked by rainbow tables in seconds
- NoSQL injection vulnerabilities in 3 routes enable data exfiltration and manipulation
- Authorization bypass allows unauthorized deletion

**HIGH (Fix before deployment):**

- Weak JWT secret with insecure default
- Missing error handlers cause hanging requests
- Duplicated auth logic is unmaintainable

**MEDIUM (Fix during refactor):**

- Magic strings reduce code clarity
- Unused imports create confusion
- Inconsistent status codes violate REST conventions

---

## Recommended Actions

1. **Immediate:** Replace MD5 with bcrypt for all password operations
2. **Immediate:** Add input validation middleware to reject spread operator injections
3. **Immediate:** Add permission checks to all sensitive operations
4. **High Priority:** Extract auth logic into middleware
5. **High Priority:** Replace all `.then()/.catch()` with async/await
6. **High Priority:** Remove or quarantine unused imports
7. **Code Quality:** Restructure into MVC: controllers, services, models, middlewares, utils
8. **Code Quality:** Replace all `var` with `const` or `let`
9. **Testing:** Add integration tests before any deployment

---

## Files Affected

- `src/app.js` - 4 smells (var usage, promise chains, unused imports, error handling)
- `src/routes.js` - 12 smells (security, N+1, auth duplication, var usage, magic strings)
- `models/User.js` - 2 smells (MD5 hashing, var usage)
- `models/Shipment.js` - 0 smells (schema only)

---

## Next Steps

1. Commit this audit with all SMELL comments in place
2. Restructure into MVC architecture
3. Replace var, rewrite promises, add security patches
4. Create comprehensive test suite
5. Document environment variables and setup process
