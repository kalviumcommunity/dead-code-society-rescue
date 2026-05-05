# Codebase Audit

## Summary

* Total smells found: 10
* Critical: 5 | High: 5 | 

---

## Issues

| File          | Issue                             | Severity | Explanation                                               |
| ------------- | --------------------------------- | -------- | --------------------------------------------------------- |
| src/routes.js | MD5 password hashing              | CRITICAL | MD5 is insecure and easily crackable using rainbow tables |
| src/routes.js | No input validation               | CRITICAL | Directly spreading req.body allows NoSQL injection        |
| src/routes.js | Hardcoded JWT secret fallback     | CRITICAL | Using default secret makes authentication vulnerable      |
| src/routes.js | No permission check on delete     | CRITICAL | Any authenticated user can delete any shipment            |
| src/routes.js | Auth logic duplicated             | CRITICAL | Repeated JWT verification instead of middleware           |
| src/routes.js | N+1 query problem                 | HIGH     | Database calls inside loop degrade performance            |
| src/routes.js | Using var instead of const/let    | HIGH     | Leads to scope issues and outdated practice               |
| src/routes.js | No proper HTTP status codes       | HIGH     | Always returning 200 instead of meaningful codes          |
| src/routes.js | Missing error handling (.catch)   | HIGH     | Leads to silent failures                                  |
| src/routes.js | No status validation              | HIGH     | Invalid shipment states possible                          |

---

## Conclusion

The codebase suffers from major security vulnerabilities, poor structure, and performance issues.
Critical improvements are required in authentication, validation, and architecture to make the system production-ready.
