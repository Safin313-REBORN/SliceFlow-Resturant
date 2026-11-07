# SliceFlow : REST API Documentation

Base URL: `/api`  
Content-Type: `application/json`  
Authentication: HTTP-only session cookie (`jwt`) or `Authorization: Bearer <token>`

---

## 1. Authentication Endpoints (`/api/auth`)

### POST `/api/auth/register`
Creates a new customer account and generates an email verification token.
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "Password123"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Registration successful. Please check your email to verify your account.",
    "data": { "userId": "...", "name": "Jane Doe", "email": "jane@example.com", "isEmailVerified": false }
  }
  ```

### POST `/api/auth/login`
Authenticates credentials, sets an HTTP-only JWT cookie, and returns user details.
- **Request Body**:
  ```json
  {
    "email": "jane@example.com",
    "password": "Password123"
  }
  ```
- **Response (200 OK)**: Sets `Set-Cookie: jwt=...; HttpOnly; SameSite=Lax; Path=/`
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": { "userId": "...", "name": "Jane Doe", "email": "jane@example.com", "role": "customer", "isEmailVerified": true }
  }
  ```

### POST `/api/auth/logout`
Clears session cookie.
- **Response (200 OK)**: Clears cookie.

### GET `/api/auth/me`
Retrieves current authenticated session.
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": { "user": { "id": "...", "name": "...", "email": "...", "role": "...", "isEmailVerified": true } }
  }
  ```

### GET `/api/auth/verify-email?token=<token>`
Validates token and marks account as verified.
- **Response (200 OK)**:
  ```json
  { "success": true, "message": "Email verified successfully." }
  ```

### POST `/api/auth/resend-verification`
Generates and sends a new verification token for unverified accounts.
- **Request Body**: `{ "email": "jane@example.com" }`

### POST `/api/auth/forgot-password`
Initiates password recovery. Always returns 200 to prevent user enumeration.
- **Request Body**: `{ "email": "jane@example.com" }`

### POST `/api/auth/reset-password`
Completes password recovery with a verified token.
- **Request Body**: `{ "token": "...", "newPassword": "NewPassword123" }`

---

## 2. Menu & Custom Pizza Builder Endpoints

### GET `/api/pizzas`
Returns public list of pre-configured pizzas with filtering and search.
- **Query Params**: `?category=Veg&search=Margherita&sort=price_asc`
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "...",
        "name": "Margherita Classica",
        "description": "Rich San Marzano tomato sauce, fresh mozzarella, and sweet basil leaves.",
        "category": "Veg",
        "basePrice": 349,
        "image": "/images/margherita.jpg",
        "isAvailable": true
      }
    ]
  }
  ```

### GET `/api/pizzas/:id`
Retrieves single pizza details with ingredient breakdown.

### GET `/api/pizza-builder/options`
Returns all customizable raw ingredients categorized into bases (5), sauces (5), cheeses, and vegetables with stock availability and price adjustments.
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "bases": [ ... 5 items ... ],
      "sauces": [ ... 5 items ... ],
      "cheeses": [ ... items ... ],
      "vegetables": [ ... items ... ]
    }
  }
  ```

---

## 3. Orders & Checkout Endpoints (`/api/orders`)

### POST `/api/orders/checkout`
Validates user verification, checks stock, computes authoritative server prices, creates a temporary stock reservation, initializes internal Order, and generates a Razorpay Order ID.
- **Request Body**:
  ```json
  {
    "items": [
      {
        "type": "custom",
        "quantity": 1,
        "baseId": "...",
        "sauceId": "...",
        "cheeseId": "...",
        "vegetableIds": ["...", "..."]
      }
    ],
    "deliveryAddress": {
      "street": "123 Main St",
      "city": "Bengaluru",
      "pincode": "560001",
      "phone": "+919876543210"
    }
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "orderId": "...",
      "amount": 49900,
      "currency": "INR",
      "razorpayOrderId": "order_Hjklm...",
      "keyId": "rzp_test_..."
    }
  }
  ```

### GET `/api/orders/my-orders`
Retrieves all orders belonging to the authenticated customer.

### GET `/api/orders/:id`
Retrieves details and real-time status of a specific order. Enforces ownership check (user can only view their own order unless admin).

---

## 4. Payment Endpoints (`/api/payments`)

### POST `/api/payments/verify`
Server-side cryptographic verification of Razorpay signature. On success, commits stock deduction and updates order status to 'Order Received'.
- **Request Body**:
  ```json
  {
    "orderId": "...",
    "razorpayOrderId": "order_...",
    "razorpayPaymentId": "pay_...",
    "razorpaySignature": "..."
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Payment verified and order confirmed.",
    "data": { "orderId": "...", "status": "Order Received" }
  }
  ```

### POST `/api/payments/cancel`
Releases short-lived stock reservations if customer aborts payment modal.

---

## 5. Administration Endpoints (`/api/admin`)
*Requires `role: 'admin'`*

### POST `/api/admin/login`
Dedicated login endpoint for administrators.

### GET `/api/admin/dashboard`
Returns aggregated analytics: total revenue, order count, orders by status, and low-stock ingredient summary.

### GET `/api/admin/orders`
Paginated and filterable list of all customer orders.

### PATCH `/api/admin/orders/:id/status`
Updates order status (`Order Received` -> `In Kitchen` -> `Sent to Delivery` -> `Delivered`), persists status audit trail, and broadcasts Socket.IO event to customer.
- **Request Body**: `{ "status": "In Kitchen", "note": "Pizza in oven" }`

### GET `/api/admin/inventory`
Full stock ledger displaying physical, reserved, and available quantities.

### PATCH `/api/admin/inventory/:id`
Updates stock quantities or re-calibrates low-stock thresholds.

### GET `/api/admin/alerts`
Retrieves history of low-stock warning triggers and notification dispatches.

