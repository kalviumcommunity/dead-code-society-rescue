# Codebase Audit
 
## Summary
- Total smells found: 16
- Critical: 5 | High: 5 | Medium: 6
 
## Issues
 
| File | Issue | Severity | Explanation |
|------|-------|----------|-------------|
| src/routes.js | Hardcoded JWT secret fallback | CRITICAL | A missing environment variable drops auth protection back to a predictable secret. |

| src/routes.js | Mass assignment from req.body | CRITICAL | Copying the full request body into the user document lets clients set privileged fields like role. |

| src/routes.js | MD5 password hashing on register | CRITICAL | MD5 is not suitable for password storage because it is fast and easy to crack. |

| src/routes.js | MD5 password verification on login | CRITICAL | Comparing credentials with MD5 keeps login secrets in a trivially reversible format. |

| src/routes.js | Shipment delete has no ownership check | CRITICAL | Any authenticated user can delete arbitrary shipments if they know the id. |

| src/routes.js | Shipment status update lacks guardrails | HIGH | The update accepts arbitrary status values and bypasses the save hook that maintains timestamps. |

| src/routes.js | N+1 query pattern in shipment listing | MEDIUM | Fetching the same user inside a shipment loop creates unnecessary database round-trips. |

| src/routes.js | Missing catch in profile lookup | MEDIUM | A database failure in the profile lookup can leave the request without a response. |

| src/app.js | Unused User import | MEDIUM | The model is imported but never used, which adds noise and hides the real boot dependencies. |

| src/app.js | Unused Shipment import | MEDIUM | The model is imported but never used, so it only increases coupling and confusion. |

| src/app.js | DATABASE_URL is not validated | HIGH | Startup can proceed with an undefined database URL instead of failing fast on bad configuration. |

| src/app.js | Server starts before DB readiness | HIGH | The process begins listening before confirming the database connection is healthy. |

| models/User.js | Password field relies on callers | HIGH | Password handling is enforced outside the schema, so the model does not protect the credential boundary. |

| models/User.js | Role is free-form | MEDIUM | A plain string role allows unexpected values to leak into authorization logic. |

| models/Shipment.js | Status is unconstrained | MEDIUM | Shipment state can become invalid because the schema does not restrict allowed values. |

| models/Shipment.js | updatedAt does not cover update queries | HIGH | The timestamp hook only runs on save, so findByIdAndUpdate can leave updatedAt stale. |
