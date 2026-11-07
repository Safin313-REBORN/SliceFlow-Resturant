---
name: razorpay-integration
description: Enterprise Razorpay payment gateway integration, order creation, HMAC-SHA256 signature verification, webhook processing, and idempotent transaction recording.
---

# Razorpay Integration Skill

## Payment Flow Architecture
1. **Order Creation (Server-Side)**:
   - Calculate order amount in paise (1 INR = 100 paise) strictly on the server.
   - Call `razorpay.orders.create({ amount, currency: 'INR', receipt, notes })`.
   - Store `razorpayOrderId` on the newly initialized internal `Order` record with payment status `PENDING`.
2. **Frontend Checkout Execution**:
   - Dynamically load Razorpay SDK (`https://checkout.razorpay.com/v1/checkout.js`).
   - Initialize `new window.Razorpay(options)` with `order_id`, `key: RAZORPAY_KEY_ID`, prefill user contact info, and theme colors (#E84736).
   - Capture `razorpay_payment_id`, `razorpay_order_id`, and `razorpay_signature`.
3. **Cryptographic Signature Verification**:
   - Generate expected signature:
     ```js
     const crypto = require('crypto');
     const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
     hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
     const generatedSignature = hmac.digest('hex');
     const isValid = generatedSignature === razorpay_signature;
     ```
   - Reject immediately if invalid with HTTP 400.
4. **Idempotency Protection**:
   - Check if `Order.paymentStatus === 'PAID'` before processing. If already paid, return existing receipt without re-running inventory commits.
5. **Webhook Security**:
   - Validate `X-Razorpay-Signature` using `RAZORPAY_WEBHOOK_SECRET` on raw request payload (`crypto.createHmac('sha256', secret).update(rawBody).digest('hex')`).

