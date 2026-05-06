# Codebase Audit

## Summary
- Total smells found: 10
- Critical: 3
- High: 4
- Medium: 3

## Issues

| File | Issue | Severity | Explanation |
|------|-------|----------|-------------|
| src/routes.js | MD5 hashing | CRITICAL | Passwords are crackable |
| src/routes.js | No validation | HIGH | User input unsafe |