# Codebase Audit
 
## Summary
- Total smells found: 10
- Critical: 3 | High: 4 | Medium: 3
 
## Issues
 
| File | Issue | Severity | Explanation |
|------|-------|----------|-------------|
| src/routes.js | MD5 password hashing | CRITICAL | MD5 is not a secure password hashing algorithm. It can be easily cracked with rainbow tables. |
| src/routes.js | Comparing MD5 hashes for authentication | CRITICAL | Authentication is vulnerable because it compares insecure MD5 hashes. |
| src/routes.js | Missing authorization check on delete | CRITICAL | Any authenticated user can delete any shipment since there is no ownership or admin check. |
| src/routes.js | Direct use of req.body with spread operator | HIGH | Using spread operator with `req.body` directly allows mass assignment and NoSQL injection. |
| src/routes.js | Unvalidated input in DB query | HIGH | Unvalidated `req.body.email` is used directly in `findOne`, leaving the app open to NoSQL injection. |
| src/routes.js | N+1 Query Problem | HIGH | Querying the `User` collection inside a loop for each shipment degrades performance significantly. |
| src/routes.js | Mass assignment in shipment creation | HIGH | Using `...req.body` to create a shipment allows users to inject restricted fields, bypassing validation. |
| src/routes.js | Inline JWT verification | MEDIUM | JWT validation logic is repeated inline instead of being abstracted into a centralized middleware. |
| src/routes.js | Magic string comparison | MEDIUM | Hardcoded status strings like 'delivered' should be defined as enums or constants to avoid typos. |
| src/routes.js | Missing error handling for promises | MEDIUM | Some promise chains like `.then()` lack a `.catch()` block, which can cause unhandled promise rejections. |
