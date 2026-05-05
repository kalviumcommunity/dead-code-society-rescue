# Changelog

## Codebase Rescue Summary

---

## 🔍 Audit Phase

* Identified 15+ code smells across the project
* Categorized issues into CRITICAL, HIGH, and MEDIUM
* Documented findings in AUDIT.md

---

## 🏗 Refactoring

* Converted monolithic routes.js into MVC architecture
* Separated concerns into routes, controllers, services, and middlewares
* Preserved original file as routes.legacy.js

---

## 🔐 Security Improvements

### Before

* MD5 used for password hashing
* Hardcoded fallback JWT secret
* No input validation
* Weak authorization checks

### After

* bcrypt implemented for secure hashing
* JWT authentication middleware added
* Joi validation applied on all routes
* Proper authorization checks enforced

---

## ⚡ Performance Improvements

### Before

* N+1 query problem due to DB calls inside loops

### After

* Replaced with Mongoose populate()
* Reduced number of DB calls significantly

---

## 🧹 Code Cleanup

* Replaced var with const/let
* Converted promise chains to async/await
* Removed unused imports
* Improved readability and maintainability

---

## 🚨 Error Handling

### Before

* Inconsistent error responses
* No centralized error handling

### After

* Introduced AppError class
* Added centralized error middleware
* Standardized HTTP status codes

---

## 📌 Result

The codebase is now:

* Secure
* Modular
* Scalable
* Maintainable
