# Changelog

## Codebase Rescue - Refactoring & Security Patches

### Refactoring
- **MVC Architecture**: Transitioned the single monolithic `routes.js` file into a separated Model-View-Controller (MVC) architecture with distinct folders for `controllers`, `services`, `middlewares`, `routes`, and `models`. This separation of concerns strictly improves maintainability limits side effects.
- **Modern JavaScript**: Replaced archaic `var` declarations with `const` and `let` for proper block scoping. Replaced lengthy `.then().catch()` Promise chains with modern `async/await` syntax, boosting code readability.
- **Centralized Error Handling**: Removed nested `try/catch` repetition in individual controllers and setup an `errorHandler` middleware. We also added custom error classes mapping to correct HTTP status codes in `utils/errors.util.js`.

### Security Improvements
- **bcrypt over MD5**: The insecure MD5 hashing for passions was instantly crackable. Replaced it with the secure `bcrypt` algorithm using 12 salt rounds for hashing and `bcrypt.compare` for verifying.
- **Joi Validation**: To avert NoSQL injections from unrestricted `req.body` spreads, added the `joi` library. Every POST/PATCH request is now sanitized through explicit `valdiate.middleware.js` checking schema adherence.
- **Authorization Enforcement**: The shipment `DELETE` route lacked authorization checks completely. It was patched inside the `shipment.service.js` to ensure only the owner or an admin could delete it.
- **Authentication Extraction**: Extracted inline JWT decodings duplicated across routes into a centralized `auth.middleware.js` to guarantee no logic skips.

### Performance
- **N+1 Query Fix**: Fixed a massive N+1 query overhead in `/api/shipments` GET function which queried the user table explicitly in a loop. Handled the inefficiency via Mongoose `.populate()`, reducing calls significantly to a single pass request.

### Documentation
- **JSDoc Generation**: Outlined heavily-detailed JSDoc string annotations for all files across services, controllers, middlewares, and utils giving parameter and exception context.
- **Overhauled README**: Crafted clear documentation for setup, environments, API endpoints, and a visual ASCII architecture map.