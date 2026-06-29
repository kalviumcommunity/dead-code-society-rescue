# Audit Summary

## Overview
This project was audited for maintainability, security, and architectural issues before the refactor.

## Findings

| Severity | File | Finding |
| --- | --- | --- |
| High | src/routes.js | The registration route trusts the entire request body and allows mass assignment. |
| High | src/routes.js | Passwords are hashed with MD5, which is insecure for authentication. |
| High | src/routes.js | Authentication logic is duplicated across routes with inline token validation. |
| High | src/routes.js | Shipment listing performs a database lookup inside a loop, causing an N+1 query problem. |
| High | src/routes.js | The delete route has no authorization check and allows any authenticated user to remove shipments. |
| Medium | src/routes.js | The API accepts unvalidated input for auth and shipment operations. |
| Medium | src/routes.js | Shipment creation uses magic strings and no schema-level validation. |
| Medium | src/routes.js | The status update route relies on a hard-coded status string and does not verify the shipment exists first. |
| Low | src/routes.js | The profile route lacks a catch handler, so failures can silently fail. |
| Low | src/routes.js | The file contains dead code, placeholder comments, and TODO markers that reduce clarity. |

## Recommended Next Steps
1. Restructure the app into MVC-style folders.
2. Introduce validation middleware and centralized error handling.
3. Replace MD5 with bcrypt and move auth checks into middleware.
4. Replace N+1 reads with populate or aggregation.
5. Document the refactor and usage in the README and changelog.
