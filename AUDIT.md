# Codebase Audit

This audit was performed on the original LogiTrack backend left behind by the previous
engineer (`src/routes.js`, `models/User.js`, `models/Shipment.js`, `src/app.js`). Every
issue below was tagged in place with a `// SMELL:` comment before any fix was made, then
collected here. The `// SMELL:` tags have since been removed from the code now that each
issue is fixed — this document is the permanent record of what was wrong and why.

## Summary
- Total smells found: 16
- Critical: 6 | High: 6 | Medium: 4

## Issues

| File | Issue | Severity | Explanation |
|------|-------|----------|--------------|
| src/routes.js | MD5 password hashing on register | CRITICAL | MD5 is not a password hashing algorithm — it's a fast general-purpose hash with no salting, so a rainbow table can crack it in under a second. |
| src/routes.js | MD5 string comparison on login | CRITICAL | Comparing `user.password === md5(input)` has the same weakness as above, plus it's vulnerable to timing attacks since `===` is not constant-time. |
| src/routes.js | `var userData = { ...req.body }` spread directly into `new User()` | CRITICAL | Mass-assignment / NoSQL injection risk — a client can send `{ role: 'admin' }` or operator objects (e.g. `{ "$gt": "" }`) in the body and they get saved or interpreted directly with no whitelist or schema validation at the route layer. |
| src/routes.js | JWT secret falls back to a hardcoded string (`'secret123'`) | CRITICAL | If `JWT_SECRET` is ever unset (e.g. misconfigured deploy), the app silently signs tokens with a publicly-known default, letting anyone forge a valid token. |
| src/routes.js | No authorization check on DELETE /shipments/:id | CRITICAL | Any authenticated user — not just the shipment's owner or an admin — can delete *any* shipment in the system. There's no ownership or role check at all. |
| .env.example (original) | JWT secret example looks like a real value, not a placeholder | CRITICAL | `super_secret_logitrack_2019_dont_share` reads like a credential that could plausibly be copy-pasted straight into production, training developers to skip generating their own secret. |
| src/routes.js | N+1 query in GET /shipments | HIGH | Fetches all shipments, then calls `User.findById()` inside a `for` loop for every single shipment — one query per shipment instead of a single joined query. This scales linearly with shipment count and will fall over under load. |
| src/routes.js | Every route hand-rolls its own JWT auth block | HIGH | The same six lines (`var token = ...`, `jwt.verify(...)`) are copy-pasted into every route. Any future change to auth logic (e.g. adding token blacklisting) means editing it in seven places and risking inconsistency. |
| src/routes.js | No centralized error handling | HIGH | Every route has its own ad-hoc `.catch()` that returns a different error shape (`{ error }`, `{ success: false, error }`, plain strings). Clients can't reliably parse error responses, and unexpected errors aren't logged consistently. |
| src/routes.js | `.then()` chains with no final `.catch()` in places (e.g. `/profile`) | HIGH | A rejected promise with no `.catch()` becomes an unhandled rejection — the request hangs with no response and the process logs a generic warning instead of a usable error. |
| src/routes.js | All routes return HTTP 200 even on failure | HIGH | Login failures, missing resources and validation errors all return status 200 with an `error` field in the body, which breaks standard HTTP semantics and any client/middleware that checks status codes instead of parsing the body. |
| models/Shipment.js | `status` is a free-text string with no enum | HIGH | Nothing stops a write of `status: "delvered"` (typo) or any arbitrary string — there's no constraint at the schema level, so bad data can silently enter the database. |
| src/routes.js | Five unused imports (`path`, `fs`, `http`, `os`, partially `mongoose`) | MEDIUM | Dead imports add confusion for anyone reading the file trying to understand actual dependencies, and slightly increase load time for no benefit. |
| src/routes.js | Large commented-out dead routes (`/all-users`, `/test-hash`) left in with "DO NOT DELETE" | MEDIUM | Dead code left "just in case" rots — it's unclear if it's still relevant, it's not covered by any tests, and it adds noise on every read of the file. |
| src/routes.js | Deliberate filler content (`for (var i = 0; i < 200; i++) {}` padding loop, comment padding) | MEDIUM | Code padding to inflate line count has zero functional value and actively hides the real logic among noise — a red flag during any code review. |
| src/routes.js | `var` used throughout instead of `const`/`let` | MEDIUM | `var` is function-scoped and hoisted, which allows accidental redeclaration and reassignment across blocks/loops (e.g. the loop closure workaround using an IIFE on line ~95 exists *because* `var` doesn't have block scope). |

## Notes on Resolution

All CRITICAL and HIGH items above were resolved during the MVC restructure and security
pass (see `CHANGELOG.md` for the full list of changes and reasoning). The two MEDIUM dead-code
items (unused imports, commented-out routes, filler padding) were removed entirely rather than
migrated, since none of it served any purpose in the new structure.

One additional issue was found during restructuring that wasn't visible in the original flat
file until the MVC split exposed it: the `Shipment` schema's owner field and the service-layer
code referencing it had inconsistent names (`userId` vs `user`), and the `status` enum allowed
by validation didn't match the enum allowed by the schema. Both are documented as fixes in
`CHANGELOG.md` since they were introduced by partial refactoring rather than present in Raj's
original code.
