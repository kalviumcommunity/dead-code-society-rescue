# Codebase Audit

## Summary
- Total smells found: 11
- Critical: 4 | High: 4 | Medium: 3

## Issues

| File | Issue | Severity | Explanation |
|------|-------|----------|-------------|
| [User.js](file:///d:/summercamp/dead-code-society-rescue/models/User.js#L15-L18) | Insecure Password Storage | CRITICAL | Storing passwords without a strong secure hashing algorithm like bcrypt. MD5 is cryptographically broken and instantly crackable. |
| [routes.js](file:///d:/summercamp/dead-code-society-rescue/src/routes.js#L26-L28) | MD5 Password Hashing | CRITICAL | MD5 password hashing is insecure and vulnerable to rainbow tables. Use bcrypt with 12 salt rounds instead. |
| [routes.js](file:///d:/summercamp/dead-code-society-rescue/src/routes.js#L56-L58) | MD5 Password Comparison | CRITICAL | MD5 comparison is used for password verification during login which is cryptographically broken and instantly crackable. |
| [routes.js](file:///d:/summercamp/dead-code-society-rescue/src/routes.js#L244-L246) | Missing Authorization Check | CRITICAL | Missing authorization check on DELETE route allows any user with a valid JWT to delete any shipment in the database. |
| [routes.js](file:///d:/summercamp/dead-code-society-rescue/src/routes.js#L20-L25) | NoSQL Injection via Object Spread | HIGH | Direct object spreading of unvalidated `req.body` enables NoSQL injection and allows clients to overwrite database fields like role. |
| [routes.js](file:///d:/summercamp/dead-code-society-rescue/src/routes.js#L48-L51) | NoSQL Injection on Login Query | HIGH | Direct query input without validation is vulnerable to NoSQL injection (e.g. query objects like `{"$ne": null}`). |
| [routes.js](file:///d:/summercamp/dead-code-society-rescue/src/routes.js#L13-L15) | Weak JWT Secret Fallback | HIGH | Falling back to a weak, hardcoded secret (`secret123`) for signing JWTs exposes the app to token forgery. |
| [routes.js](file:///d:/summercamp/dead-code-society-rescue/src/routes.js#L112-L115) | N+1 Query Bottleneck | HIGH | Database query is called inside a loop to fetch user details for each shipment, creating an N+1 queries performance bottleneck. |
| [routes.js](file:///d:/summercamp/dead-code-society-rescue/src/routes.js#L88-L93) | Duplicated Authentication Logic | MEDIUM | Authentication logic is duplicated inline across multiple routes instead of being centralized in a reusable middleware. |
| [routes.js](file:///d:/summercamp/dead-code-society-rescue/src/routes.js#L41-L45) | Generic Error Handling & 200 HTTP status | MEDIUM | Inline error handling sends generic error details and uses successful HTTP 200 OK statuses for failures instead of correct HTTP status codes. |
| [routes.js](file:///d:/summercamp/dead-code-society-rescue/src/routes.js#L271-L276) | Missing Promise Catch Block | MEDIUM | Missing `.catch()` block on profile route database query can lead to unhandled promise rejections and potential application crashes. |
