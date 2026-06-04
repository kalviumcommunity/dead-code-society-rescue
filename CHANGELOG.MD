# CHANGELOG

## [1.0.0] - Codebase Rescue Refactor

### Security Fixes

#### Replaced MD5 with bcrypt

**Problem:**
Passwords were stored using MD5 hashing, which is vulnerable to rainbow table attacks and can be cracked quickly.

**Solution:**
Implemented bcrypt with 12 salt rounds for secure password hashing and password verification.

**Improvement:**
User credentials are now significantly more secure.

---

#### Added JWT Authentication Middleware

**Problem:**
JWT verification logic was duplicated across multiple routes.

**Solution:**
Created centralized authentication middleware.

**Improvement:**
Reduced code duplication and improved maintainability.

---

#### Added Authorization Checks

**Problem:**
Any authenticated user could delete shipments.

**Solution:**
Implemented ownership and admin authorization checks.

**Improvement:**
Users can only manage resources they own unless they are administrators.

---

### Validation Improvements

#### Added Joi Validation

**Problem:**
Request bodies were passed directly into database operations without validation.

**Solution:**
Implemented Joi schemas and reusable validation middleware.

**Improvement:**
Prevents malformed requests, injection attempts, and invalid data.

---

### Architecture Refactoring

#### Migrated to MVC Architecture

**Problem:**
All application logic existed inside a single routes file.

**Solution:**
Separated responsibilities into:

* Routes
* Controllers
* Services
* Models
* Middlewares
* Validators
* Utilities

**Improvement:**
Cleaner architecture and easier maintenance.

---

### Performance Improvements

#### Fixed N+1 Query Problem

**Problem:**
Shipment listing executed database queries inside loops.

**Solution:**
Used Mongoose populate() to fetch related user data efficiently.

**Improvement:**
Reduced database round trips and improved performance.

---

### Code Quality Improvements

#### Replaced var with const and let

**Improvement:**
Modern JavaScript standards and safer variable scoping.

---

#### Converted Promise Chains to Async/Await

**Improvement:**
Improved readability and simplified error handling.

---

#### Added Centralized Error Handling

**Improvement:**
Consistent API error responses across the application.

---

#### Added JSDoc Documentation

**Improvement:**
Improved code readability and maintainability.

---

#### Removed Dead Code and Unused Imports

**Improvement:**
Reduced technical debt and codebase clutter.

---

### Documentation

#### Added AUDIT.md

Documented all identified code smells and severity levels.

#### Updated README.md

Added:

* Installation guide
* Environment variables
* API documentation
* Architecture overview
* Authentication instructions

---

## Final Result

The application has been transformed from a monolithic, insecure codebase into a secure, maintainable MVC backend following modern Node.js development practices.
