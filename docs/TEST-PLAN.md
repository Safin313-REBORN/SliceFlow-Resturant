# SliceFlow : Comprehensive QA & Test Plan

## 1. Test Strategy Overview
Quality assurance is structured across three verification tiers:
1. **Automated Unit & Integration Tests (Supertest & Vitest)**:
   - Backend auth logic, token verification, route validation.
   - Authoritative pricing calculations and stock availability checks.
   - HMAC signature verification.
2. **End-to-End Browser Automation**:
   - Customer journey from sign-up, verification, customization, checkout, to live order tracking.
   - Admin management flow from login, inventory updates, to order status progression.
3. **Responsive Visual Audits**:
   - Visual inspection and layout verification across 360px, 768px, 1024px, and 1440px viewports.

---

## 2. Test Cases & Verification Matrix

### Category A: Authentication & Security
- `TC-AUTH-01`: Register new customer with valid inputs -> Expect 201 Created & verification email dispatched.
- `TC-AUTH-02`: Register duplicate email -> Expect 409 Conflict with clear error message.
- `TC-AUTH-03`: Register with password < 8 chars or no numbers -> Expect 400 Bad Request.
- `TC-AUTH-04`: Attempt checkout with unverified email -> Expect 403 Forbidden with prompt to verify.
- `TC-AUTH-05`: Verify email with valid token -> Expect account `isEmailVerified` marked true.
- `TC-AUTH-06`: Attempt customer login to `/admin/login` -> Expect 403 Forbidden.
- `TC-AUTH-07`: Access another customer's order ID -> Expect 403 Forbidden / 404 Not Found.

### Category B: Pizza Builder & Ordering Logic
- `TC-BUILD-01`: Load custom pizza builder -> Verify exactly 5 Bases and 5 Sauces rendered.
- `TC-BUILD-02`: Try advancing to step 2 without selecting base -> Expect step validation alert.
- `TC-BUILD-03`: Multi-select vegetables -> Ensure live price updates dynamically on frontend and matches backend computation.
- `TC-BUILD-04`: Add customized pizza to cart -> Verify ingredients and customizations are accurately preserved in cart state.

### Category C: Payment & Inventory Concurrency
- `TC-PAY-01`: Initiate checkout -> Verify temporary stock reservation is created.
- `TC-PAY-02`: Submit valid Razorpay signature -> Expect payment verified, stock committed, and order status set to `Order Received`.
- `TC-PAY-03`: Submit invalid / tampered Razorpay signature -> Expect 400 Bad Request, rejection of payment, and reservation rollback.
- `TC-PAY-04`: Prevent duplicate payment processing (idempotency test).
- `TC-PAY-05`: Attempt checkout when stock is 0 -> Expect checkout rejection with specific out-of-stock message.

### Category D: Admin & Real-Time Functionality
- `TC-ADMIN-01`: Admin logs in with configured credentials -> Access dashboard metrics.
- `TC-ADMIN-02`: Admin updates order status to `In Kitchen` -> Customer receives live WebSocket event in real-time.
- `TC-ADMIN-03`: Admin adjusts inventory stock below threshold -> Low-stock notification is recorded and dispatched.

---

## 3. Evidence Documentation
All test executions and results will be recorded in `docs/QA-REPORT.md` with explicit status (PASS / FAIL / BLOCKED) and execution logs.

