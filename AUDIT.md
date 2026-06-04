# Codebase Audit

## Summary
- Total smells found: 10
- Critical: 4
- High: 3
- Medium: 3

## Issues

| File | Issue | Severity | Explanation |
|------|--------|----------|-------------|
| src/routes.js | Hardcoded JWT secret | CRITICAL | Easily guessable secret allows token forgery |
| src/routes.js | Direct req.body spread | CRITICAL | Enables NoSQL injection and mass assignment |
| src/routes.js | MD5 password hashing | CRITICAL | Insecure and crackable password storage |
| src/routes.js | Missing ownership check on delete | CRITICAL | Users can delete others' shipments |
| src/routes.js | Duplicate auth logic | HIGH | Authentication repeated across routes |
| src/routes.js | N+1 query problem | HIGH | Multiple unnecessary DB calls |
| src/routes.js | Missing catch block | HIGH | Can cause unhandled promise rejections |
| src/routes.js | var usage | MEDIUM | Reduced scope safety and readability |
| src/routes.js | Magic strings | MEDIUM | Hardcoded status values reduce maintainability |
| src/routes.js | Dead code | MEDIUM | Increases file size and maintenance cost |