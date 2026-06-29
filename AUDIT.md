# Codebase Audit

## Summary
- Total smells found: 12
- Critical: 4 | High: 4 | Medium: 4

## Issues

1. Missing .env in .gitignore (CRITICAL) - Sensitive config variables like database URLs and JWT secret keys are checked into version control instead of being ignored.
2. MD5 password hashing (CRITICAL) - Passwords are hashed using weak MD5 instead of a secure, slow algorithm like bcrypt.
3. No input validation on signup (CRITICAL) - Request body parameters are saved directly into the database instead of being validated and sanitized first.
4. NoSQL injection on login (CRITICAL) - Email lookup queries search req.body directly instead of checking input types to prevent injection payloads.
5. Duplicated auth block (HIGH) - JWT token checks are copy-pasted across 6 routes instead of being handled by a single auth middleware.
6. N+1 queries on shipment fetch (HIGH) - User profiles are retrieved one-by-one inside a loop instead of using populate to load them in 2 queries.
7. Missing catch blocks (HIGH) - Promisified DB calls are missing .catch() handlers instead of forwarding errors to a centralized handler.
8. Broken authorization on delete (HIGH) - Shipment deletion accepts any ID without ownership checks instead of verifying the user owns the shipment.
9. Dead code and unused imports (MEDIUM) - Empty loops and unused packages (path, fs, http) are loaded instead of removing unused variables.
10. Magic status strings (MEDIUM) - Hardcoded string status check conditions are written directly in routes instead of using standard status constants.
11. var used for declarations (MEDIUM) - Variables are declared using var instead of block-scoped const or let.
12. Schema comment encouraging MD5 (MEDIUM) - Developer comment in schema says md5 is easy to test instead of enforcing security best practices.
