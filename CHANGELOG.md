# Changelog

All notable changes to the LogiTrack backend codebase will be documented in this file.

## [1.1.0] - Architecture & Security Rescue Overhaul

### Architecture

**MVC Restructure**
* **Before:** The entire backend (routing, DB queries, auth logic, request handling) existed in one massive 600-line `src/routes.js` file.
* **Why it was a problem:** This flat structure created immense technical debt, making testing nearly impossible and code extremely difficult to maintain or debug.
* **Improvement:** Extracted logic into a strict Model-View-Controller architecture separating `src/routes`, `src/controllers`, and `src/services`.

**N+1 Query Optimization**
* **Before:** The `GET /shipments` route triggered a database query inside a loop for every shipment found (e.g., 20 shipments triggered 21 database queries).
* **Why it was a problem:** Caused exponential performance degradation, database blocking, and massive memory overhead.
* **Improvement:** Removed loops and implemented Mongoose `.populate()` chained with `.lean()` to fetch all required user data via a single, highly-optimized query.

### Security

**MD5 to bcrypt Migration**
* **Before:** Passwords were automatically hashed using `md5`.
* **Why it was a problem:** MD5 is a fundamentally broken hash algorithm, highly susceptible to rainbow tables and brute-force collision attacks, rendering user passwords trivially crackable.
* **Improvement:** Fully removed `md5` dependencies and replaced them with `bcrypt` utilizing 12 cryptographic salt rounds.

**Joi Input Validation**
* **Before:** Request bodies were injected directly into Mongoose models using the spread operator (`{...req.body}`).
* **Why it was a problem:** Enabled severe Mass Assignment and NoSQL injection vulnerabilities, allowing attackers to manipulate queries or force admin privileges.
* **Improvement:** Integrated `Joi` validation middleware on all `POST` and `PATCH` routes to explicitly validate parameters and strip unknown keys before they ever hit the controllers.

**JWT Middleware Extraction**
* **Before:** JWT signature verification logic was duplicated inside every single protected route block.
* **Why it was a problem:** Violated DRY (Don't Repeat Yourself) principles and created massive security blind spots if a single route forgot to implement the check.
* **Improvement:** Centralized token verification into a reusable `authMiddleware` that intercepts and protects routes uniformly.

### Error Handling & Documentation

**Centralized Error Handling**
* **Before:** Controllers possessed unhandled promise rejections, leaked raw Mongoose database traces to API clients, and returned HTTP 200 codes for hard backend failures.
* **Why it was a problem:** Exposed underlying schema details to attackers, broke REST API consumer integrations, and caused unpredictable hanging server processes.
* **Improvement:** Implemented a global Express error middleware (`errorHandler`) and semantic custom error classes (`NotFoundError`, `UnauthorizedError`) to guarantee uniform, safe JSON responses with proper HTTP status codes.

**Comprehensive Documentation**
* **Before:** No inline documentation, making the system tribal knowledge.
* **Why it was a problem:** New engineers could not safely navigate or implement changes in the chaotic codebase.
* **Improvement:** Added complete inline `JSDoc` blocks for all exported functions across the repository, alongside a modernized `README.md` and detailed `CHANGELOG.md` to ensure production-grade onboarding.
