# Codebase Audit

## Summary

- Total smells found: 10
- Critical: 4 | High: 4 | Medium: 2

## Issues

| File               | Issue                                         | Severity | Explanation                                                                                      |
| ------------------ | --------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------ |
| src/routes.js      | Hardcoded JWT fallback secret                 | CRITICAL | Tokens can be forged if the environment variable is missing because the fallback is predictable. |
| src/routes.js      | MD5 password hashing on register              | CRITICAL | MD5 is not a password hash and is far too fast to protect credentials.                           |
| src/routes.js      | MD5 password comparison on login              | CRITICAL | The login flow verifies passwords with MD5 instead of a slow password verifier.                  |
| models/User.js     | Password field documents MD5 storage          | CRITICAL | The schema reinforces unsafe password handling instead of a secure hash policy.                  |
| src/routes.js      | Overposting via req.body spread               | HIGH     | Copying the full request body lets unexpected fields reach the model and data layer.             |
| src/routes.js      | Repeated inline JWT verification              | HIGH     | Every protected route duplicates auth logic instead of using a reusable middleware.              |
| src/routes.js      | N+1 query loop in shipments listing           | HIGH     | The route fires one extra user lookup per shipment, which scales poorly.                         |
| src/routes.js      | Shipment delete has no ownership check        | HIGH     | An authenticated user can delete any shipment without proving ownership or admin rights.         |
| src/app.js         | Dead imports and mixed bootstrapping concerns | MEDIUM   | The entrypoint imports unused models and helpers, which blurs responsibilities.                  |
| models/Shipment.js | Weak status and timestamp handling            | MEDIUM   | Status is free-form and the timestamp hook can miss update queries.                              |
