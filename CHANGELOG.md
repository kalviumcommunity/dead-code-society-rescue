# CHANGELOG

## [Refactored] — 2026-04-20

---

## 🔐 Security Fixes

### Replaced MD5 with bcrypt
- **Problem:** MD5 is a fast hash and easily crackable using rainbow tables
- **Fix:** Implemented bcrypt with 12 salt rounds
- **Improvement:** Passwords are now computationally expensive to crack

### Removed req.body spread usage
- **Problem:** Allowed users to inject fields like role=admin
- **Fix:** Explicitly extracted and assigned fields
- **Improvement:** Prevents privilege escalation attacks

### Added authorization checks on delete
- **Problem:** Any authenticated user could delete any shipment
- **Fix:** Added ownership/admin verification before deletion
- **Improvement:** Ensures only authorized users can modify data

### Removed hardcoded JWT fallback
- **Problem:** Weak default secret ('secret123') used if env missing
- **Fix:** Enforced usage of environment variable
- **Improvement:** Stronger authentication security

---

## 🏗 Architecture Refactor

### Converted flat routes into structured MVC
- **Problem:** Single file handled routing, logic, and DB operations
- **Fix:** Split into routes, controllers, services, middlewares
- **Improvement:** Clear separation of concerns and scalability

### Extracted authentication middleware
- **Problem:** JWT verification duplicated across routes
- **Fix:** Created reusable auth middleware
- **Improvement:** Single source of truth for authentication logic

---

## ⚡ Performance Improvements

### Fixed N+1 query problem
- **Problem:** Fetching user data inside loops caused multiple DB calls
- **Fix:** Used Mongoose `.populate()`
- **Improvement:** Reduced queries from N+1 to constant (2 queries)

---

## 🧼 Code Quality Improvements

### Replaced var with const/let
- **Problem:** Function-scoped variables causing unpredictable behavior
- **Fix:** Updated all declarations to const/let
- **Improvement:** Block scoping and safer variable handling

### Rewrote promise chains to async/await
- **Problem:** Nested .then() chains reduced readability
- **Fix:** Converted all async logic to async/await
- **Improvement:** Cleaner and more maintainable code

### Removed unused imports and dead code
- **Problem:** Unused modules and commented code cluttered files
- **Fix:** Deleted unused dependencies and legacy code
- **Improvement:** Cleaner and more readable codebase

---

## 📦 Model Improvements

### Added schema validation
- **Fixes:**
  - Email normalization (lowercase, trim)
  - Role enum enforcement
  - Shipment status enum
  - Weight validation (min: 0)

### Replaced manual timestamps
- **Problem:** createdAt/updatedAt handled manually
- **Fix:** Enabled Mongoose timestamps option
- **Improvement:** Automatic and consistent time tracking

---

## 🚀 API Improvements

### Proper HTTP status codes
- **Fix:** Implemented correct responses (200, 201, 400, 401, 403, 404, 409, 500)
- **Improvement:** Standards-compliant API behavior

### Sanitized responses
- **Fix:** Removed password from responses
- **Improvement:** Prevents sensitive data leaks