---
name: mongodb-architecture
description: Guidelines for MongoDB and Mongoose data modeling, schema validation, indexing, referential integrity, and efficient query pipelines.
---

# MongoDB Architecture Skill

## Data Modeling Strategy
1. **Schema Design**:
   - `User`: Handles credentials, verification tokens, reset tokens, role definitions.
   - `Pizza`: Pre-configured pizzas with base recipe references, base pricing, and availability.
   - `Ingredient`: Modular components for pizza builder categorized as `base`, `sauce`, `cheese`, `vegetable`.
   - `Inventory`: Tracks physical quantities, reserved quantities, units, and threshold alarms.
   - `StockReservation`: Ephemeral reservations linking order requests to ingredient allocations with TTL expiry.
   - `Order`: Full immutable order record with customer reference, snapshot of items, snapshot of customization details, total calculations, payment identifiers, and status history.
   - `InventoryAlert`: Audit log of low-stock triggers preventing email notification spam.
2. **Indexing Practices**:
   - Unique sparse/regular indexes on critical identifiers: `User.email`, `Order.razorpayOrderId`.
   - Compound indexes for frequent query paths: `{ userId: 1, createdAt: -1 }` on Orders.
   - Categorical lookup indexes: `{ category: 1, isAvailable: 1 }` on Ingredients and Pizzas.
   - TTL indexes on ephemeral collections: `{ expiresAt: 1 }` on `StockReservation`.
3. **Data Integrity**:
   - Never store calculated values without schema constraints or backend recalculation.
   - Enforce enum values on state transitions (e.g., Order statuses: `Order Received`, `In Kitchen`, `Sent to Delivery`, `Delivered`).

