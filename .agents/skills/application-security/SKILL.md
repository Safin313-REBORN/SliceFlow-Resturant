---
name: application-security
description: Production-grade defensive security guidelines covering Helmet HTTP headers, CORS whitelisting, rate limiting, request validation with Zod, NoSQL injection mitigation, and secret protection.
---

# Application Security Skill

## Defense-in-Depth Checklist
1. **HTTP Security Headers**:
   - Apply `helmet()` to set Secure-Transport, X-Content-Type-Options, X-Frame-Options, and Content-Security-Policy.
2. **CORS Restrictions**:
   - Restrict origins to explicitly configured development and production frontend URLs with credentials enabled.
3. **Rate Limiting**:
   - `express-rate-limit` on general API routes (100 reqs / 15 min).
   - Strict rate limiting on authentication routes (10 reqs / 15 min for login/register/password-reset) to prevent brute force.
4. **Input Sanitization & Validation**:
   - Validate every request body, query parameter, and param using `zod` schemas.
   - Reject unexpected keys and types.
   - Sanitize inputs to prevent NoSQL query injection (e.g. `{ $gt: '' }`).
5. **Credential & Secret Protection**:
   - Store all API keys, secrets, and database strings in environment variables (`.env`).
   - Provide clean `.env.example` with zero real secrets.
   - Ensure `.gitignore` explicitly blocks `.env`, `node_modules`, and sensitive key files.
   - Mask sensitive fields in logs (passwords, tokens, razorpay secret).

