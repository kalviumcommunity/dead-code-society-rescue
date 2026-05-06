# CHANGELOG

## Audit Phase
- Added code smell comments across app.js and routes.js
- Created AUDIT.md documenting security and architecture issues

---

## MVC Refactor
- Moved authentication routes into MVC structure
- Moved shipment routes into MVC structure
- Created separate routes, controllers, and services folders

---

## Code Refactoring
- Replaced var with const/let
- Replaced Promise chains with async/await
- Reduced duplicate logic across routes

---

## Security Improvements
- Replaced MD5 password hashing with bcrypt
- Added JWT authentication middleware
- Removed .env from Git tracking
- Added protected route authentication

---

## Validation
- Added Joi validation middleware
- Added validation schemas for auth and shipment routes
- Sanitized request body using stripUnknown

---

## Error Handling
- Added centralized error middleware
- Added custom error utility classes
- Improved API error responses

---

## Performance Improvements
- Fixed N+1 query problem using populate()
- Removed repeated database queries inside loops

---

## Documentation
- Added JSDoc comments
- Updated README.md with setup instructions and API documentation