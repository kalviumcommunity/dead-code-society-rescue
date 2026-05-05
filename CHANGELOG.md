# Changelog

## [Unreleased]

### Audit
- Added `AUDIT.md` documenting all major code smells.
- Tagged insecure hashing, N+1 queries, missing validation, duplicate auth code, and missing permission checks.

### Refactor
- Restructured the flat backend into MVC:
  - `src/routes`
  - `src/controllers`
  - `src/services`
  - `src/models`
  - `src/middlewares`
  - `src/utils`
  - `src/validators`
- Removed the legacy flat `src/routes.js` and root `models/` folder.

### Security
- Replaced insecure MD5 hashing with bcrypt using 12 salt rounds.
- Added secure JWT auth middleware and centralized token verification.
- Replaced inline auth logic with reusable `authMiddleware`.
- Prevented NoSQL injection by validating and stripping unknown properties with Joi.

### Performance
- Fixed N+1 query pattern in shipment listing using Mongoose `populate`.
- Removed database calls inside a loop and returned populated user details in a single query.

### Stability
- Added centralized error handling with custom error classes.
- Removed duplicate inline try/catch blocks from controllers.
- Added validation middleware for all request bodies.

### Documentation
- Added a full `README.md` with setup, environment variables, and API reference.
- Added `CHANGELOG.md` with the reasons behind each refactor.
