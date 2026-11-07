# SliceFlow — Database Schema & Data Dictionary

SliceFlow utilizes MongoDB with Mongoose ODM. This document outlines the schema design, field constraints, relationships, and indexing strategies.

---

## 1. User Collection (`users`)

Stores customer and administrator profiles, credentials, and verification tokens.

| Field | Type | Required | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `name` | String | Yes | Trimmed, 2-50 chars | Full name of the user |
| `email` | String | Yes | Unique, Lowercase, Indexed | Verified primary email address |
| `password` | String | Yes | Min 8 chars (Bcrypt hash) | Hashed password (never plain text) |
| `role` | String | Yes | Enum: `['customer', 'admin']`, Default: `'customer'` | Access authorization role |
| `isEmailVerified` | Boolean | Yes | Default: `false` | Gatekeeper flag for placing orders |
| `verificationTokenHash` | String | No | Sparse index | SHA-256 hash of email verification token |
| `verificationTokenExpiry` | Date | No | | Expiration timestamp for email token |
| `passwordResetTokenHash` | String | No | Sparse index | SHA-256 hash of password reset token |
| `passwordResetExpiry` | Date | No | | Expiration timestamp for reset token |
| `createdAt` / `updatedAt`| Date | Auto | Timestamps enabled | Document creation and update times |

---

## 2. Pizza Collection (`pizzas`)

Stores pre-configured, specialty, and signature pizzas shown on the public menu.

| Field | Type | Required | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `name` | String | Yes | Unique, Trimmed | Marketing name of the pizza |
| `description` | String | Yes | Trimmed | Flavor notes, toppings, and details |
| `image` | String | Yes | URL / Path | High-res editorial photo |
| `category` | String | Yes | Enum: `['Veg', 'Non-Veg', 'Specialty']` | Menu classification |
| `basePrice` | Number | Yes | Min: 0 (in INR) | Starting price for standard medium size |
| `isAvailable` | Boolean | Yes | Default: `true` | Kitchen menu availability flag |
| `recipe` | Array | No | Subdocuments | Default ingredients required for stock deduction |
| `recipe[].ingredientId` | ObjectId | Yes | Ref: `'Ingredient'` | Referenced raw ingredient |
| `recipe[].quantityRequired` | Number| Yes | Min: 1 | Number of units consumed per pizza |

---

## 3. Ingredient Collection (`ingredients`)

Catalog of individual raw pizza components available in the 4-step custom pizza builder.

| Field | Type | Required | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `name` | String | Yes | Unique, Trimmed | Ingredient name (e.g., "Sourdough Crust") |
| `category` | String | Yes | Enum: `['base', 'sauce', 'cheese', 'vegetable']` | Customization step category |
| `description` | String | No | Trimmed | Culinary profile description |
| `priceAdjustment` | Number | Yes | Default: 0 | Additional cost added to base price |
| `image` | String | No | URL / Asset path | Visual icon / photo for ingredient card |
| `isAvailable` | Boolean | Yes | Default: `true` | Active ordering state |

*Note: Database seeding guarantees exactly 5 Bases and 5 Sauces as required by the specification.*

---

## 4. Inventory Collection (`inventories`)

Real-time stock ledger managing physical quantities, short-lived reservations, and threshold alerts.

| Field | Type | Required | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `ingredientId` | ObjectId | Yes | Unique, Ref: `'Ingredient'` | Linked raw ingredient |
| `name` | String | Yes | Trimmed | Mirrored name for fast lookup |
| `category` | String | Yes | Enum: `['base', 'sauce', 'cheese', 'vegetable']` | Component category |
| `quantity` | Number | Yes | Min: 0, Integer | Actual physically available units |
| `reservedQuantity` | Number | Yes | Min: 0, Default: 0 | Units locked during in-flight checkouts |
| `lowStockThreshold` | Number | Yes | Default: 20 | Quantity at which alert triggers |
| `unit` | String | Yes | Default: `'portions'` | Measurement unit (portions, grams, etc.) |
| `lastUpdated` | Date | Auto | Timestamps | Stock modification timestamp |

---

## 5. StockReservation Collection (`stock_reservations`)

Transient reservations maintaining ACID isolation during Razorpay checkout flows.

| Field | Type | Required | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `orderId` | ObjectId | Yes | Indexed, Ref: `'Order'` | Target order undergoing payment |
| `items` | Array | Yes | Subdocuments | List of ingredients and reserved units |
| `items[].ingredientId` | ObjectId| Yes | Ref: `'Ingredient'` | Ingredient reserved |
| `items[].quantity` | Number | Yes | Min: 1 | Units held |
| `status` | String | Yes | Enum: `['PENDING', 'COMMITTED', 'RELEASED']` | Reservation lifecycle state |
| `expiresAt` | Date | Yes | TTL Index (15 mins) | Automatic expiration boundary |

---

## 6. Order Collection (`orders`)

The financial and operational single source of truth for customer transactions.

| Field | Type | Required | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `userId` | ObjectId | Yes | Indexed, Ref: `'User'` | Owning customer |
| `customerDetails` | Object | Yes | Name, email, phone, delivery address | Snapshot of contact & delivery info |
| `orderItems` | Array | Yes | Subdocuments | Standard and customized pizzas |
| `orderItems[].type` | String | Yes | Enum: `['standard', 'custom']` | Pizza type |
| `orderItems[].pizzaId`| ObjectId | No | Ref: `'Pizza'` | Present if standard pizza |
| `orderItems[].name` | String | Yes | Name | Pizza display name |
| `orderItems[].quantity`| Number | Yes | Min: 1 | Number of pizzas |
| `orderItems[].unitPrice`| Number | Yes | Min: 0 | Price per unit calculated by server |
| `orderItems[].customization` | Object | No | Snapshot of Base, Sauce, Cheese, Veggies | Selected ingredient breakdown |
| `subtotal` | Number | Yes | Min: 0 | Sum of line items |
| `deliveryFee` | Number | Yes | Default: 40 | Flat delivery charge |
| `tax` | Number | Yes | Default: 0 | Applicable GST/tax |
| `totalAmount` | Number | Yes | Min: 0 | Final payable sum (INR) |
| `paymentStatus` | String | Yes | Enum: `['PENDING', 'PAID', 'FAILED', 'REFUNDED']` | Razorpay payment state |
| `orderStatus` | String | Yes | Enum: `['Order Received', 'In Kitchen', 'Sent to Delivery', 'Delivered', 'Cancelled']` | Kitchen & fulfillment status |
| `razorpayOrderId` | String | No | Unique, Sparse Index | Razorpay order reference |
| `razorpayPaymentId` | String | No | Sparse Index | Razorpay captured payment reference |
| `razorpaySignature` | String | No | Cryptographic proof | Verified HMAC signature |
| `statusHistory` | Array | Auto | Subdocuments: `{ status, timestamp, note }` | Audit trail of status changes |

---

## 7. InventoryAlert Collection (`inventory_alerts`)

Prevents redundant email dispatch for persistent low-stock conditions.

| Field | Type | Required | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `ingredientId` | ObjectId | Yes | Unique, Ref: `'Ingredient'` | Ingredient in low-stock state |
| `alertStatus` | String | Yes | Enum: `['ACTIVE', 'RESOLVED']` | Notification status |
| `thresholdSnapshot`| Number | Yes | | Configured threshold at trigger time |
| `stockSnapshot` | Number | Yes | | Recorded stock at trigger time |
| `lastNotifiedAt` | Date | Yes | Default: Date.now | Timestamp email was dispatched |

---

## 8. Database Performance & Compound Indexing Strategy

To guarantee production-grade latency under high concurrency and prevent full collection scans ($O(N)$ operations), the following compound indexes are enforced at the Mongoose driver level:

1. **`orders`**:
   - `{ userId: 1, createdAt: -1 }`: Optimizes customer dashboard queries fetching the authenticated user's order history sorted chronologically.
   - `{ orderStatus: 1, createdAt: -1 }`: Optimizes admin order queue filtering and fulfillment workflows.
   - `{ paymentStatus: 1, createdAt: -1 }`: Accelerates financial reconciliation queries.
   - `{ razorpayOrderId: 1 }` (Sparse, Unique): Instant $O(1)$ lookup upon receiving Razorpay webhook/client payment signatures.

2. **`inventories`**:
   - `{ ingredientId: 1 }` (Unique): Ensures exact 1:1 mapping with ingredient records.
   - `{ category: 1, quantity: 1 }`: Supports category-based stock breakdown views in the admin console.
   - `{ quantity: 1, lowStockThreshold: 1 }`: Used by background threshold checking routines.

3. **`stock_reservations`**:
   - `{ status: 1, expiresAt: 1 }`: Enables $O(\log N)$ scanning for node-cron background cleanup of expired in-flight checkouts (`status: 'PENDING'`).
   - `{ orderId: 1, status: 1 }`: Instant resolution when committing or releasing reserved inventory upon payment confirmation/failure.

4. **`inventory_alerts`**:
   - `{ alertStatus: 1, lastNotifiedAt: -1 }`: Powers real-time admin alert panel with pre-sorted active stock warnings.

5. **`pizzas` & `ingredients`**:
   - `{ category: 1, isAvailable: 1 }`: Instant index-covered queries for public menu and 4-step builder option payloads.


