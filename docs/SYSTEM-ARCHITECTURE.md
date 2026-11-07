# SliceFlow : System Architecture

## Architecture Diagram

```
+-----------------------------------------------------------------------------------+
|                                 CLIENT TIER                                       |
|                                                                                   |
|  +------------------------------------+   +------------------------------------+  |
|  |     Customer Web Portal (React)    |   |      Admin Control Center (React)  |  |
|  |  - Home, Menu, Builder, Cart       |   |  - Analytics, Inventory Management |  |
|  |  - Order Tracking, Profile, Auth   |   |  - Order Control, Low-Stock Alerts |  |
|  +-----------------+------------------+   +-----------------+------------------+  |
|                    |                                        |                     |
|                    +-------------------+--------------------+                     |
|                                        |                                          |
|                          REST HTTP / WebSocket (Socket.IO)                        |
+----------------------------------------|------------------------------------------+
                                         v
+-----------------------------------------------------------------------------------+
|                                SERVER TIER (Node.js & Express)                    |
|                                                                                   |
|  +-------------------+  +-------------------+  +--------------------------------+ |
|  | Security Pipeline |  |  API Controllers  |  |      Real-Time Engine          | |
|  | - Helmet, CORS    |  |  - Auth, Catalog  |  |      - Socket.IO Hub           | |
|  | - Rate Limiter    |  |  - Order, Payment |  |      - Room-based targeted     | |
|  | - Cookie Parser   |  |  - Admin, Reports |  |        order status broadcasts | |
|  +---------+---------+  +---------+---------+  +---------------+----------------+ |
|            |                      |                            |                  |
|            v                      v                            v                  |
|  +------------------------------------------------------------------------------+ |
|  |                              Business Services Layer                         | |
|  |  - AuthService (JWT + Bcrypt)        - RazorpayService (HMAC-SHA256)         | |
|  |  - InventoryReservationService       - CronService (Low-Stock Alert Email)   | |
|  +---------------------------------------+--------------------------------------+ |
+------------------------------------------|----------------------------------------+
                                           v
+-----------------------------------------------------------------------------------+
|                               PERSISTENCE & 3RD-PARTY                             |
|                                                                                   |
|  +------------------------------------+   +------------------------------------+  |
|  |     MongoDB Replica Set Engine     |   |      External Payment & Mail       |  |
|  |  - User, Pizza, Ingredient         |   |  - Razorpay Test Payment Gateway   |  |
|  |  - Inventory, StockReservation     |   |  - Nodemailer SMTP Mail Transport  |  |
|  |  - Order, InventoryAlert           |   |                                    |  |
|  |  - Multi-document ACID Transactions|   |                                    |  |
|  +------------------------------------+   +------------------------------------+  |
+-----------------------------------------------------------------------------------+
```

## Component Architecture

### 1. Client Tier (React 18 + Vite + Tailwind CSS)
- **Modular Layouts**:
  - `CustomerLayout`: Includes the customer navigation bar, announcements, main content outlet, and responsive footer.
  - `AdminLayout`: Includes the persistent sidebar, top status bar with quick metrics, and breadcrumb navigation.
- **State Management**:
  - React Context API handles distinct global domains: `AuthContext` (tokens, user profile, verification status), `CartContext` (cart items, quantities, customized pizza options, local storage synchronization), and `SocketContext` (managed WebSocket connection, auto-reconnect, event listeners).
- **Network Layer**:
  - Axios client configured with `withCredentials: true` to seamlessly pass secure HTTP-only session cookies and intercept 401 unauthenticated errors.

### 2. Server Tier (Express.js + Node.js)
- **Layered Architecture**:
  - Strict separation of routing definitions, request validation, controller logic, domain service methods, and database access.
- **Middleware Chain**:
  - `helmet`: Hardens security headers against clickjacking, MIME sniffing, and cross-site scripting.
  - `cors`: Explicitly allows requests from `http://localhost:5173` and configured domains with credentials enabled.
  - `rateLimiter`: Protects against brute-force attacks on auth routes (10 requests / 15 minutes) and DDoS on general APIs (100 requests / 15 minutes).
  - `verifyToken`: Extracts and validates JWT claims from cookies or `Authorization` headers.
  - `restrictTo`: Role-based gatekeeper ensuring only accounts with `role: 'admin'` access administrative endpoints.
  - `errorHandler`: Global unhandled exception and validation error formatter.

### 3. Real-Time Engine (Socket.IO)
- Socket connections authenticate using JWT cookies during the initial handshake.
- Upon connecting, customers automatically join their private user room: `room: user_${userId}`.
- When an order's status is modified by an administrator in `/api/admin/orders/:id/status`, the server dispatches a targeted event (`order:status_updated`) specifically to `room: user_${order.userId}`, preventing data leakage across customers.

### 4. Background Job Engine (node-cron)
- Hourly or event-driven cron scheduled job scans the `Inventory` collection for items where `quantity <= lowStockThreshold`.
- Prevents notification fatigue through the `InventoryAlert` model: emails are only triggered once per alert cycle, rearming only after stock is replenished above threshold and depleted again.

