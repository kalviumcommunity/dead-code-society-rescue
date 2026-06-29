# CHANGELOG

## Refactored Setup

### Security Fixes
- **Bcrypt instead of MD5**: Switched password hashing to bcrypt (12 rounds) on signup and login. MD5 is insecure and crackable in seconds.
- **Joi Validation**: Added schema validations on all routes accepting a body. Prevents custom payloads and parameter hijacking.
- **Added .env to .gitignore**: Prevented pushing configs and secrets to git.
- **Object-level Auth on Delete**: Only the owner of the shipment or an admin can delete a shipment.

### Architecture Refactors
- **MVC Architecture**: Restructured the 600-line `routes.js` file into clean directories: routes, controllers, services, models, middlewares, utils.
- **Auth Middleware**: Extracted JWT verification blocks into a single middleware.

### Performance
- **Fixed N+1 Queries**: Shipment listing used to make a query for every user in a loop. Fixed by using Mongoose `.populate('userId')` to fetch all details in 2 queries.

### Syntax & Standards
- **No var**: Replaced var with const and let.
- **Async/Await**: Rewrote promise chains to async/await.
- **Centralized Error Handling**: Added custom errors and a single error handler middleware, removing try/catch loops in controllers.
