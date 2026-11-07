---
name: database-transactions
description: Best practices for atomic multi-document operations, conditional stock updates, two-phase reservation/commit workflows, and concurrent inventory locking in MongoDB.
---

# Database Transactions & Concurrent Inventory Skill

## Two-Phase Stock Reservation Pattern
To prevent overselling and race conditions when multiple customers order simultaneously:
1. **Phase 1: Temporary Reservation at Checkout Initiation**
   - Atomically check if `quantity - reservedQuantity >= requiredQuantity`.
   - Update `reservedQuantity += requiredQuantity` using atomic conditional query:
     ```js
     await Inventory.findOneAndUpdate(
       { _id: item._id, $expr: { $gte: [{ $subtract: ["$quantity", "$reservedQuantity"] }, requiredQty] } },
       { $inc: { reservedQuantity: requiredQty } },
       { new: true, session }
     );
     ```
   - Create a `StockReservation` document with `expiresAt: Date.now() + 15 * 60 * 1000` (15 minutes).
2. **Phase 2: Payment Verification and Stock Deduction**
   - Upon confirmed payment, inside a MongoDB ACID transaction:
     - Mark `StockReservation` as `COMMITTED`.
     - Atomically deduct physical `quantity` and decrement `reservedQuantity`:
       ```js
       await Inventory.updateOne(
         { _id: item._id },
         { $inc: { quantity: -requiredQty, reservedQuantity: -requiredQty } },
         { session }
       );
       ```
3. **Phase 3: Rollback / Expiration Handling**
   - If payment fails, is cancelled, or the reservation TTL lapses without confirmation:
     - Atomically decrement `reservedQuantity`:
       ```js
       await Inventory.updateOne(
         { _id: item._id },
         { $inc: { reservedQuantity: -requiredQty } }
       );
       ```
     - Mark `StockReservation` as `RELEASED`.

## Concurrency Guardrails
- Guaranteed non-negative inventory (`quantity >= 0`, `reservedQuantity >= 0`).
- Transactions isolate updates across multiple ingredients per pizza order.

