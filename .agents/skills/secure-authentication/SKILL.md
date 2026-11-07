---
name: secure-authentication
description: Protocols for implementing robust, production-grade JWT authentication, HTTP-only cookie management, password hashing with bcrypt, email verification tokens, and role-based access control.
---

# Secure Authentication Skill

## Authentication Architecture
1. **Password Security**:
   - Hash all passwords using `bcrypt` (minimum 10-12 salt rounds).
   - Enforce strong password complexity: minimum 8 characters, at least one number, and one letter.
   - Never log or return raw passwords or password hashes in API responses.
2. **Token Management**:
   - Issue JSON Web Tokens (JWT) containing non-sensitive payload claims (`id`, `role`, `email`).
   - Deliver JWT in secure `httpOnly`, `sameSite: 'lax'`, `secure` (in production) cookies to guard against XSS extraction.
   - Support authorization bearer headers for API/testing flexibility while keeping cookies primary.
3. **Email Verification**:
   - Generate cryptographically secure random hexadecimal tokens (`crypto.randomBytes(32).toString('hex')`).
   - Store the SHA-256 hash of the token in the database alongside a realistic expiration timestamp (e.g. 24 hours).
   - Require verified email status (`isEmailVerified === true`) before allowing order checkout.
4. **Password Reset Flow**:
   - Request reset: Generate hashed single-use token with short expiration (e.g. 1 hour).
   - Invalidate token immediately upon successful password change.
   - Generic response for forgot-password: "If an account exists with that email, a reset link has been dispatched." (prevents user enumeration).
5. **Role-Based Access Control (RBAC)**:
   - Dedicated `role` property (`customer` vs `admin`).
   - Route-level middleware (`protect`, `restrictTo('admin')`) verifying valid JWT and active matching role.

