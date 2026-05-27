# Codebase Audit

## Summary
- Total smells found: 35
- Critical: 8 | High: 12 | Medium: 11 | Low: 4

## Issues

| File | Issue | Severity | Explanation |
|------|-------|----------|-------------|
| src/routes.js | MD5 password hashing | CRITICAL | Not a password algorithm; instantly crackable |
| src/routes.js | NoSQL injection via spread operator | CRITICAL | Spread operator enables injection attacks |
| src/routes.js | No input validation on req.body | CRITICAL | No validation allows malicious input |
| src/routes.js | MD5 password comparison | CRITICAL | Insecure comparison method |
| src/routes.js | NoSQL injection on shipment creation | CRITICAL | Spread operator enables injection |
| src/routes.js | No permission check on delete | CRITICAL | Anyone with token can delete any shipment |
| models/User.js | MD5 password storage | CRITICAL | Comment indicates insecure password hashing |
| src/routes.js | Weak JWT secret default | HIGH | Fallback value 'secret123' is weak |
| src/routes.js | Generic error handling | HIGH | No proper status codes or error details |
| src/routes.js | N+1 query problem | HIGH | Database calls inside loop |
| src/routes.js | Database calls inside loop | HIGH | Causes performance issues |
| src/routes.js | Silent failure on User.findById | HIGH | No error handling for DB call |
| src/routes.js | Generic error handling | HIGH | No proper status codes |
| src/routes.js | Generic error handling | HIGH | No proper status codes |
| src/routes.js | Generic error handling | HIGH | No proper status codes |
| src/routes.js | No validation on status value | HIGH | Invalid status values accepted |
| src/routes.js | Generic error handling | HIGH | No proper status codes |
| src/routes.js | Generic error handling | HIGH | No proper status codes |
| src/routes.js | Missing catch block | HIGH | Unhandled promise rejection |
| src/app.js | Deprecated Mongoose options | HIGH | useNewUrlParser, useUnifiedTopology deprecated |
| src/app.js | No proper DB error handling | HIGH | App continues even if DB fails |
| src/routes.js | Using var instead of const/let | MEDIUM | Modern JS should use const/let |
| src/routes.js | Unused imports | LOW | path, fs, http, os not used |
| src/routes.js | Wrong HTTP status code | MEDIUM | Using 200 instead of 201 for creation |
| src/routes.js | Magic string 'pending' | MEDIUM | Should use enum constant |
| src/routes.js | Magic string comparison | MEDIUM | Should use enum constant |
| src/routes.js | Dead code - empty loop | LOW | Loop just pads line count |
| src/routes.js | TODO comments instead of fixes | MEDIUM | Issues noted but not fixed |
| src/app.js | Using var instead of const/let | MEDIUM | Modern JS should use const/let |
| src/app.js | Unused import | LOW | path not used |
| src/app.js | Manual model loading | MEDIUM | Should use centralized loader |
| src/app.js | Deprecated bodyParser | MEDIUM | Should use express.json() |
| src/app.js | No 404 handler | MEDIUM | Clients get no proper error response |
| src/app.js | Server starts without DB | MEDIUM | Should wait for DB connection |
| src/app.js | No global error handler | LOW | Unhandled errors not caught |
| models/User.js | Using var instead of const/let | MEDIUM | Modern JS should use const/let |
| models/User.js | Magic string 'user' | MEDIUM | Should use enum constant |
| models/User.js | No password validation | LOW | No strength requirements |
| models/Shipment.js | Using var instead of const/let | MEDIUM | Modern JS should use const/let |
| models/Shipment.js | Magic string 'pending' | MEDIUM | Should use enum constant |
| models/Shipment.js | No status validation | LOW | Invalid values accepted |
