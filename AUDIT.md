# Codebase Audit
 
## Summary
- Total smells found: 10
- Critical: 5 | High: 3 | Medium: 2
 
## Issues
 
| File | Issue | Severity | Explanation |
|------|-------|----------|-------------|
| src/routes.js | No input validation | CRITICAL | req.body is passed directly to the DB in POST /register, enabling NoSQL injection. |
| src/routes.js | MD5 password hashing | CRITICAL | MD5 is not a password algorithm; instantly crackable with rainbow tables. |
| src/routes.js | Direct query object passing | CRITICAL | req.body.email passed directly to DB in POST /login, enabling injection. |
| src/routes.js | N+1 Query Problem | HIGH | Fetching user inside a loop for each shipment. Results in massive DB load. |
| src/routes.js | Duplicate auth logic | MEDIUM | Duplicate auth verification logic in every route. Should be a centralized middleware. |
| src/routes.js | Unhandled promise chain | HIGH | Missing .catch() in User.findById(req.userId) causing silent failures. |
| src/routes.js | Missing authorization | HIGH | No permission check on DELETE /shipments/:id. Any user can delete any shipment. |
| src/app.js | var used everywhere | MEDIUM | Using var causes hoisting bugs. const/let should be used. |
| models/User.js | MD5 schema note | CRITICAL | Schema indicates MD5 usage. It must support long bcrypt hashes. |
| .gitignore | Missing .env | CRITICAL | .env is not ignored, meaning sensitive secrets will be committed to version control. |
