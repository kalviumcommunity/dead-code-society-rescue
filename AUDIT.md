# Codebase Audit: LogiTrack Backend

## Executive Summary
This codebase contains **15 critical to medium-severity code smells** that create security vulnerabilities, performance issues, and maintainability problems. Most critically: passwords are hashed with MD5 (crackable in milliseconds), no input validation (NoSQL injection possible), and an unmaintainable monolithic routing file.

**Total Issues: 15** | CRITICAL: 3 | HIGH: 5 | MEDIUM: 7

---

## Audit Table

| File | Issue | Severity | Details |
|------|-------|----------|---------|
| `src/routes.js` | MD5 used for password hashing | **CRITICAL** | MD5 is a cryptographic hash, not a password hashing algorithm. Rainbow tables can crack MD5 passwords in milliseconds. Must use bcrypt with 12 salt rounds. |
| `src/routes.js` | No input validation on req.body | **CRITICAL** | Spread operator passes raw req.body directly to database. Attacker can send `{"$gt": ""}` triggering NoSQL injection. All endpoints vulnerable. |
| `.gitignore` | .env file not listed | **CRITICAL** | If this repo becomes public (GitHub), JWT_SECRET and DATABASE_URL are exposed. Attacker gets full database access. |
| `src/routes.js` | Duplicate JWT verification blocks | **HIGH** | Same auth check (lines ~105, ~135, ~165, ~205, ~265, ~310) copied 6+ times. If JWT verification logic needs updating, must change all 6 places = bug risk. |
| `src/routes.js` | N+1 query problem in shipment listing | **HIGH** | Lines ~120-145: Fetches all shipments (1 query), then loops and fetches user for each (N queries). 100 shipments = 101 DB round trips. Fix: use `.populate('userId')`. |
| `src/routes.js` | No centralized error handling | **HIGH** | Each route has its own try/catch with inconsistent response formats. Line ~275 missing .catch() entirely. Difficult to maintain, inconsistent status codes (using 200 for errors). |
| `src/routes.js` | God file - mixed concerns | **HIGH** | Single 330-line file handles routing, auth, validation, business logic, and DB queries. No separation of concerns (MVC). Impossible to test, reuse, or modify safely. |
| `src/routes.js` | var used throughout | **MEDIUM** | Lines 1-12: Using `var` causes function-scoped hoisting bugs. Should use `const` (preferred) or `let`. Standard since ES6 (2015). |
| `src/routes.js` | Promise chains instead of async/await | **MEDIUM** | Lines ~25-40, ~48-80: Deeply nested `.then().catch()` chains reduce readability. Async/await is cleaner and is the modern standard. |
| `src/routes.js` | Unused imports | **MEDIUM** | Lines 8-11: `path`, `fs`, `http`, `os` imported but only `os` used in status route (line 320). Dead code noise. |
| `src/routes.js` | Dead code - commented routes | **MEDIUM** | Lines ~290-303: Two old routes commented out but never deleted. Confusing for new developers. Should be removed or in version control history. |
| `src/routes.js` | Magic strings and numbers | **MEDIUM** | Line ~182: `status: 'pending'` without constant. Line ~197: Status comparison `if (req.body.status === 'delivered')` repeated. Use shared constants. Line ~232: User role check `!== 'admin'` is fragile. |
| `src/routes.js` | No permission check on DELETE | **MEDIUM** | Lines ~255-270: DELETE /shipments/:id allows ANY authenticated user to delete ANY shipment. No ownership verification. Critical authorization bug. |
| `models/User.js` | No schema validation | **MEDIUM** | Email field not unique at schema level (only at DB). Password field has no constraints (accepts empty string). Name field no min/max length. |
| `README.md` | Incomplete documentation | **MEDIUM** | Installation section cut off. No environment variable guide, no API reference, no setup instructions complete. New developer cannot set up project without help. |

---

## Severity Breakdown

### 🔴 CRITICAL (3) - Fix First, Risk of Data Breach
1. **MD5 password hashing** - User passwords can be cracked in seconds
2. **No input validation** - Database is vulnerable to NoSQL injection
3. **.env not in .gitignore** - Secrets can be exposed if repo becomes public

### 🟠 HIGH (5) - Fix Next, Affects Maintenance & Performance
4. **Duplicate JWT verification** - Authorization logic scattered and hard to maintain
5. **N+1 query in shipment listing** - Performance degrades with data
6. **No centralized error handling** - Inconsistent responses and status codes
7. **God file structure** - Cannot test or modify safely
8. **var instead of const/let** - Hoisting bugs possible

### 🟡 MEDIUM (7) - Fix During Refactor, Technical Debt
9. **Promise chains** - Readability issues
10. **Unused imports** - Code noise
11. **Dead code** - Confusing
12. **Magic strings/numbers** - Maintainability issues
13. **No permission check on DELETE** - Authorization bug
14. **Weak schema validation** - Data integrity at risk
15. **Incomplete README** - Cannot onboard new developers

---

## What Will Be Fixed

This refactor will:
✅ Replace MD5 with bcrypt (12 rounds) — passwords now secure  
✅ Add Joi validation on all endpoints — NoSQL injection prevented  
✅ Move .env to .gitignore — secrets protected  
✅ Centralize JWT verification in middleware — code reuse + maintainability  
✅ Fix N+1 with .populate() — shipment listing now 2 queries instead of N+1  
✅ Create error.middleware.js — consistent error handling + status codes  
✅ Restructure into MVC — routes, controllers, services, models separated  
✅ Convert to const/let — eliminate hoisting bugs  
✅ Rewrite as async/await — cleaner code  
✅ Remove dead code — cleaner codebase  
✅ Add constants for magic strings — safer and more maintainable  
✅ Add permission checks — secure all endpoints  
✅ Strengthen schema validation — data integrity  
✅ Write complete README — onboard new developers in <5 min  
✅ Add JSDoc — all functions documented  

---

## Next Step
See CHANGELOG.md for implementation details as they are completed.
