# Codebase Audit

## Summary

- Total smells found: 13
- Critical: 4 | High: 5 | Medium: 4

## Issues

| File                                   | Issue                                   | Severity | Explanation                                                                 |
| -------------------------------------- | --------------------------------------- | -------- | --------------------------------------------------------------------------- |
| src/services/auth.service.js           | MD5 dependency for passwords            | CRITICAL | Using MD5 for password handling is insecure and trivial to crack.           |
| src/utils/jwt.util.js                  | Hardcoded JWT secret fallback           | CRITICAL | A default secret enables token forgery if env config is missing.            |
| src/services/auth.service.js           | MD5 password comparison on login        | CRITICAL | Weak verification keeps credentials vulnerable to offline cracking.         |
| src/services/auth.service.js           | Mass assignment from req.body           | HIGH     | Spreading raw request data allows NoSQL injection and privilege escalation. |
| src/controllers/auth.controller.js     | Returning full user object              | HIGH     | Responses can leak password hashes and internal fields.                     |
| src/services/shipment.service.js       | N+1 queries for shipment users          | HIGH     | Per-item DB lookups in a loop cause slow responses at scale.                |
| src/services/shipment.service.js       | Raw req.body in shipment create         | HIGH     | Unvalidated fields can be persisted or override protected data.             |
| src/controllers/shipment.controller.js | Missing authorization on delete         | HIGH     | Any authenticated user can delete any shipment.                             |
| src/services/shipment.service.js       | Missing error handling in user lookup   | MEDIUM   | Unhandled promise failures can hang requests or leak errors.                |
| src/controllers/user.controller.js     | Missing error handling in profile route | MEDIUM   | Database failures are not surfaced to clients.                              |
| src/controllers/health.controller.js   | Status endpoint leaks system info       | MEDIUM   | OS and memory exposure aids attackers and reveals internals.                |
| src/app.js                             | No explicit 404/error handlers          | MEDIUM   | Missing centralized errors leads to inconsistent responses.                 |
| src/services/auth.service.js           | MD5 hashing during registration         | CRITICAL | New passwords are stored with MD5 instead of a slow adaptive hash.          |
