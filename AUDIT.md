# Codebase Audit

## Summary

- Total smells found: 13
- Critical: 7 | High: 4 | Medium: 2

## Issues

| File          | Issue                          | Severity | Explanation                                               | Status                                 |
| ------------- | ------------------------------ | -------- | --------------------------------------------------------- | -------------------------------------- |
| src/routes.js | MD5 password hashing           | CRITICAL | Not a password algorithm; instantly crackable             | ✅ Fixed (bcrypt in use)               |
| src/routes.js | No input validation            | CRITICAL | Accepts any fields, vulnerable to injection and bad data  | ✅ Fixed (Joi validation)              |
| src/routes.js | Spread operator on req.body    | CRITICAL | Enables NoSQL injection, saves arbitrary fields           | ✅ Fixed (Joi + explicit fields)       |
| src/routes.js | Hardcoded JWT secret fallback  | CRITICAL | Should only use environment variable for secrets          | ⚠️ Still falls back, see .env          |
| src/routes.js | No authentication middleware   | CRITICAL | JWT check is duplicated, not reusable                     | ✅ Fixed (auth middleware)             |
| src/routes.js | N+1 query in /shipments        | HIGH     | Fetches user details in a loop, causes performance issues | ✅ Fixed (populate)                    |
| src/routes.js | DB call inside loop            | HIGH     | Inefficient, can overload DB                              | ✅ Fixed (populate)                    |
| src/routes.js | No permission check on delete  | HIGH     | Any user with a token can delete any shipment             | ⚠️ Still open (add check)              |
| src/routes.js | Missing .catch() in /profile   | HIGH     | Unhandled promise rejection possible                      | ✅ Fixed (async/await + error handler) |
| src/routes.js | Using var instead of let/const | HIGH     | Use block-scoped variables for safety                     | ✅ Fixed (let/const everywhere)        |
| src/routes.js | Unused imports                 | MEDIUM   | path, fs, http are imported but never used                | ✅ Fixed (removed)                     |
| src/routes.js | Always returns 200 OK          | MEDIUM   | Should use proper HTTP status codes for errors            | ✅ Fixed (error middleware)            |
| src/routes.js | MD5 password check in login    | CRITICAL | Use bcrypt.compare for secure password verification       | ✅ Fixed (bcrypt in use)               |

## Notes

- All controllers now use async/await and centralized error handling.
- Input validation is enforced with Joi schemas and middleware.
- See README.md for onboarding and architecture details.
- See CHANGELOG.md for a summary of all major changes.
