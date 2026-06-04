# Codebase Audit

## Summary

* Total smells found: 19
* Critical: 7
* High: 8
* Medium: 4

## Issues

| File               | Issue                                   | Severity | Explanation                                 |
| ------------------ | --------------------------------------- | -------- | ------------------------------------------- |
| src/routes.js      | MD5 password hashing                    | CRITICAL | MD5 is insecure and easily cracked          |
| src/routes.js      | No request validation                   | CRITICAL | Allows malicious input                      |
| src/routes.js      | Direct req.body spread                  | CRITICAL | NoSQL injection risk                        |
| src/routes.js      | Hardcoded JWT secret fallback           | CRITICAL | Weakens authentication security             |
| src/routes.js      | Shipment creation uses raw request body | CRITICAL | User controls database fields               |
| src/routes.js      | Missing authorization on delete         | CRITICAL | Any authenticated user can delete shipments |
| .gitignore         | Missing .env                            | CRITICAL | Secrets may be committed                    |
| src/routes.js      | Repeated JWT verification blocks        | HIGH     | Duplicate authentication logic              |
| src/routes.js      | N+1 query problem                       | HIGH     | One database query per shipment             |
| src/routes.js      | Missing catch blocks                    | HIGH     | Silent failures possible                    |
| src/routes.js      | Promise chains                          | HIGH     | Reduced readability and maintainability     |
| src/routes.js      | God file                                | HIGH     | Routing, logic and database mixed together  |
| src/routes.js      | User object returned directly           | HIGH     | May expose sensitive data                   |
| src/routes.js      | Magic strings                           | MEDIUM   | Hard to maintain                            |
| src/routes.js      | Dead code                               | MEDIUM   | Increases code noise                        |
| src/routes.js      | Unused imports                          | MEDIUM   | Unnecessary dependencies loaded             |
| src/app.js         | var usage                               | MEDIUM   | Hoisting and scope issues                   |
| models/User.js     | No role enum validation                 | MEDIUM   | Invalid roles can be stored                 |
| models/Shipment.js | No status enum validation               | MEDIUM   | Invalid statuses can be stored              |

## Refactoring Plan

1. Replace MD5 with bcrypt
2. Add Joi validation middleware
3. Move code into MVC architecture
4. Extract authentication middleware
5. Implement centralized error handling
6. Fix N+1 query with populate()
7. Replace var with const/let
8. Convert promise chains to async/await
9. Add JSDoc documentation
10. Create README and CHANGELOG
