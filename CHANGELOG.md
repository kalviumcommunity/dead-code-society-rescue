# Changelog

## 1.0.1 - Backend Rescue

### Reworked

| Change | Why it was needed | Improvement |
|---|---|---|
| Replaced the flat `routes.js` monolith with `routes/`, `controllers/`, `services/`, `middlewares/`, `utils/`, `models/`, and `validators/` | Routing, persistence, auth, and error handling were all mixed together and impossible to extend safely | Each layer now has one job, which makes the code easier to reason about and test |
| Swapped `var` for `const` and `let` | `var` leaked scope and made the code harder to audit | Variables now have predictable lifetime and intent |
| Rewrote promise chains as async/await | Nested `.then()` blocks hid flow control and error paths | Async code reads top-to-bottom and works cleanly with centralized error handling |
| Replaced MD5 with bcrypt | MD5 is not a password hash and is trivially cracked | Passwords are now hashed with bcrypt at 12 rounds |
| Added Joi validation middleware | Routes accepted raw request bodies and allowed unexpected fields | Invalid input now returns 422 and unknown fields are stripped before business logic runs |
| Extracted JWT auth into middleware | Inline token checks were duplicated across protected routes | Authorization is consistent and reusable across all protected endpoints |
| Added centralized error handling | Routes returned inconsistent errors and swallowed failures | Errors now carry proper status codes and one JSON response format |
| Fixed the shipment N+1 query pattern with `populate()` | The old code queried the user collection inside a shipment loop | Shipment listing now uses a constant number of queries regardless of shipment count |
| Added JSDoc to exported helpers, controllers, services, and middleware | The handoff had no documentation and no fast onboarding path | New engineers can understand inputs, outputs, and failure modes without reading every implementation detail |
| Wrote a complete README and API reference | There was no setup or endpoint documentation | A new developer can clone, configure, and run the service quickly |

### Security and data handling

- Input validation now strips unknown fields before persistence.
- Protected routes require a JWT bearer token.
- Shipment access checks prevent unauthorized reads, updates, and deletes.
- The app uses a single error middleware to avoid leaking internal stack traces into route code.