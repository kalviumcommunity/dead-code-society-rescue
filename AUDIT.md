# Codebase Audit

## Summary

- Total smells found: 15
- Critical: 6
- High: 5
- Medium: 4

## Issues

| File | Issue | Severity | Explanation |
|------|-------|----------|-------------|
| routes.js | MD5 password hashing | CRITICAL | MD5 is insecure and easily cracked |
| routes.js | Mass assignment in register | CRITICAL | Allows privilege escalation via role injection |
| routes.js | Password returned in response | HIGH | Sensitive data exposure |
| routes.js | No authorization on delete | CRITICAL | Any authenticated user can delete shipments |
| routes.js | No authorization on update | CRITICAL | Users can modify other shipments |
| routes.js | N+1 query problem | HIGH | Database query inside loop |
| routes.js | Missing input validation | HIGH | Invalid data can be stored |
| routes.js | Repeated auth code | MEDIUM | Violates DRY principle |
| routes.js | Unused imports | MEDIUM | Increases maintenance burden |
| routes.js | Missing catch blocks | MEDIUM | Unhandled promise failures |
| User.js | Role not restricted | HIGH | Invalid roles can be assigned |
| Shipment.js | Status not validated | HIGH | Invalid shipment states allowed |
| app.js | No 404 handler | MEDIUM | Poor API usability |
| app.js | Server starts without DB | MEDIUM | Application instability |
| .env.example | Weak JWT secret | HIGH | Token security risk |