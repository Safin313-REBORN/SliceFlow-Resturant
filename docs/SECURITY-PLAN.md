# SliceFlow : Application Security & Concurrency Plan

## 1. Threat Modeling & Defensive Controls

| Threat Vector | Mitigation Strategy | Implementation Details |
| :--- | :--- | :--- |
| **Credential Theft & Brute Force** | Bcrypt hashing + Rate Limiting | Passwords hashed with 10 salt rounds. Auth routes rate-limited to 10 attempts per 15 minutes per IP. |
| **XSS & Session Hijacking** | HTTP-Only Cookies + CSP | Authentication JWT stored in `httpOnly`, `sameSite: 'lax'` cookies. Helmet sets XSS and MIME protections. |
| **Tampered Client Pricing** | Server-authoritative calculations | Prices submitted by clients are completely discarded. The server computes item totals, taxes, and delivery fees directly from MongoDB records. |
| **Forged Payment Confirmations** | Server-side HMAC-SHA256 signature checks | Client claims of payment success are ignored. Payments are marked `PAID` only when `crypto.createHmac('sha256', secret).update(orderId + "|" + paymentId).digest('hex')` matches the Razorpay signature. |
| **Inventory Overselling & Race Conditions**| Two-Phase Reservation with Atomic Locking | Stock is reserved during checkout using atomic conditional updates (`$expr: { $gte: [...] }`). Stock is deducted inside MongoDB transactions upon payment verification. |
| **Broken Object-Level Authorization (BOLA)**| Explicit ownership verification | Users can query only orders matching `userId === req.user.id`. Admin role check is strictly enforced on `/api/admin/*`. |
| **Real-Time Data Leaks** | Room-based Socket.IO authorization | Socket connections verify JWT tokens on handshake. Order status events are only emitted to private rooms: `user_${userId}`. |

---

## 2. Concurrency & Race Condition Blueprint

### Problem:
Two customers simultaneously order the last unit of "Sourdough Base" (#Base1). Without concurrency protection, both orders would pass stock verification and oversell the inventory to negative numbers.

### Solution:
SliceFlow enforces atomic two-phase reservations:

```
[Customer A Checkout]                         [Customer B Checkout]
         |                                              |
         v                                              v
Step 1: Check & Reserve                        Step 1: Check & Reserve
Inventory.findOneAndUpdate({                   Inventory.findOneAndUpdate({
  _id: Base1,                                    _id: Base1,
  quantity - reservedQuantity >= 1               quantity - reservedQuantity >= 1
}, { $inc: { reservedQuantity: 1 } })          }, { $inc: { reservedQuantity: 1 } })
         |                                              |
  [SUCCEEDS] -> Reservation created                     |
         |                                              v
         |                                      [FAILS (Available: 0)]
         |                                              |
         v                                              v
Proceed to Payment Gateway                      Reject Checkout with HTTP 400:
         |                                      "Sourdough Base is out of stock"
         |
Payment Successful -> Server verifies HMAC
Commit Reservation -> quantity -= 1, reservedQuantity -= 1
```

If payment times out or customer cancels, a reservation cleanup process releases the `reservedQuantity` back to the available pool.

---

## 3. Secret Management
- Razorpay Key Secret and JWT secrets are stored exclusively in `.env`.
- Frontend never has access to the Razorpay Secret.
- Git repository excludes `.env` and all credential artifacts.

