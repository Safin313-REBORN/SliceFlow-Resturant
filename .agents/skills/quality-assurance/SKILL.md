---
name: quality-assurance
description: QA test matrix protocols, test execution recording, regression testing, and verification reporting across functional, security, performance, and accessibility dimensions.
---

# Quality Assurance Skill

## Test Categories
1. **Unit & Integration Tests**:
   - Backend APIs (Supertest): Auth endpoints, inventory calculations, transaction atomicity, signature verification.
   - Frontend components (Vitest & Testing Library): Component rendering, state transitions, validation errors.
2. **Security & Boundary Tests**:
   - Duplicate registrations, weak passwords, unverified customer checkout rejection.
   - Non-admin access to admin routes (`/api/admin/*`, `/admin/*`).
   - Cross-user order inspection prevention.
   - Negative inventory and overselling prevention under concurrent checks.
3. **Accessibility Audits**:
   - High contrast ratios (WCAG AA compliant).
   - ARIA roles, landmarks, semantic tags, and keyboard focus outlines.
4. **Documentation**:
   - Maintain `docs/QA-REPORT.md` recording status (PASS, FAIL, BLOCKED, NOT TESTED) with concrete evidence.

