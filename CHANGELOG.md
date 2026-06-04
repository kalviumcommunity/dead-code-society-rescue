# Changelog

## 2026-06-04

- Audit: tagged code smells across the legacy routes and wrote an audit report.
  - Reason: no visibility into security and maintenance risks.
  - Improvement: concrete list of issues with severity for remediation tracking.
- Refactor: restructured the codebase into MVC folders (routes/controllers/services/models/middlewares/utils).
  - Reason: single flat file mixed routing, auth, and DB logic.
  - Improvement: clearer separation of concerns and easier onboarding.
- Refactor: replaced `var` with `const`/`let` and converted Promise chains to async/await.
  - Reason: inconsistent style and hard-to-read async flow.
  - Improvement: clearer control flow and fewer callback chains.
- Feature: added Joi validation middleware and schemas for body-accepting routes.
  - Reason: requests were accepted without validation or sanitization.
  - Improvement: consistent 422 responses and safe `req.body` inputs.
- Security: replaced MD5 password hashing with bcrypt and centralized JWT auth middleware.
  - Reason: MD5 is insecure for passwords and auth checks were duplicated.
  - Improvement: stronger credential protection and reusable auth enforcement.
- Refactor: introduced centralized error handling and custom error classes.
  - Reason: inline error handling duplicated response logic across controllers.
  - Improvement: consistent error responses and simpler controllers.
- Performance: removed N+1 queries using Mongoose populate on shipment lists.
  - Reason: per-row lookups scaled poorly with data size.
  - Improvement: fewer queries and faster shipment responses.
- Docs: rewrote README with quick start, env vars, API reference, and architecture diagram.
  - Reason: prior documentation was incomplete and outdated.
  - Improvement: new engineers can start in minutes with clear setup steps.
