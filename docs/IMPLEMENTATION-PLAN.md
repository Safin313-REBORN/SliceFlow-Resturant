# SliceFlow — Implementation Plan

## Project Overview
**SliceFlow** is an enterprise-grade full-stack pizza delivery and inventory management web application built for Oasis Infobyte Internship (Web Development Level 3, Task 1). It combines a customer ordering platform featuring an interactive 4-step custom pizza builder, real-time order tracking, and Razorpay test payment integration with a backend and admin inventory control dashboard featuring two-phase stock reservations, transactional consistency, low-stock threshold monitoring, and cron-driven alerts.

---

## Development Milestones

### Milestone 1: Environment & Architecture Foundations
- [x] Workspace inspection (Node.js v22, npm 10, Google Chrome, Linux environment).
- [x] Verify local MongoDB replica-set transaction capability.
- [x] Activate and document engineering skills in `docs/SKILL-USAGE.md`.
- [x] Author comprehensive architecture specifications:
  - System Architecture (`docs/SYSTEM-ARCHITECTURE.md`)
  - Database Schema & Indexes (`docs/DATABASE-SCHEMA.md`)
  - REST API Specification (`docs/API-DOCUMENTATION.md`)
  - Security & Concurrency Plan (`docs/SECURITY-PLAN.md`)
  - QA & Testing Strategy (`docs/TEST-PLAN.md`)

### Milestone 2: Backend Architecture & Persistence Engine
- Initialize `server/` Node.js + Express application with ES Modules.
- Set up Mongoose models:
  - `User`, `Pizza`, `Ingredient`, `Inventory`, `StockReservation`, `Order`, `InventoryAlert`.
- Implement security middleware:
  - Helmet, CORS with credentials, cookie-parser, express-rate-limit, centralized error handling.
- Build services and controllers:
  - Authentication service (bcrypt, JWT HTTP-only cookies, crypto-hashed tokens for email verification & password reset).
  - Pizza & Ingredient catalog service.
  - Inventory reservation and transaction engine with two-phase commit.
  - Razorpay order initialization and HMAC-SHA256 signature verification service.
  - Admin dashboard analytics & order management service.
  - Low-stock notification engine via Nodemailer & node-cron.
  - Socket.IO server with authenticated room-based order update channels.
- Database seeder script (`server/scripts/seed.js`):
  - 5 Pizza Bases, 5 Sauces, Cheese selections, multiple Vegetables.
  - Standard pre-built pizzas with recipes.
  - Inventory items with thresholds.
  - Default administrative account and demo customer account.

### Milestone 3: Design System & Frontend Application Setup
- Initialize `client/` React.js application using Vite, Tailwind CSS, Lucide React, and Socket.IO client.
- Configure SliceFlow design system:
  - Palette: Tomato Red (`#E84736`), Warm Cream (`#FFF8EF`), Charcoal (`#202124`), Golden Yellow (`#F4B942`), Pure White (`#FFFFFF`), Muted Slate (`#6B7280`).
  - Typography: Inter & Poppins.
  - Custom UI primitives: Button, Card, Badge, Modal, Input, Toast, Skeleton, Stepper.
- Establish Client Contexts:
  - `AuthContext`: Session tracking, login, logout, verification status.
  - `CartContext`: Cart persistence, quantity controls, dynamic price recalculation.
  - `SocketContext`: Live WebSocket connection for real-time order tracking.

### Milestone 4: Customer Experience Implementation
- **Navbar & Navigation**: Responsive drawer, category links, cart preview badge, profile dropdown.
- **Homepage (`/`)**: Hero section with editorial photography, featured pizzas, custom builder promo, why choose SliceFlow, how it works, demo testimonials, footer.
- **Authentication Pages**:
  - Registration (`/register`): Strong password rules, email verification prompt.
  - Verify Email (`/verify-email`): Token validation screen with resend link.
  - Login (`/login`): Password toggle, remember-me support, redirect to target route.
  - Forgot & Reset Password (`/forgot-password`, `/reset-password`).
- **Menu Catalogue (`/menu`)**: Search bar, category filter (Veg, Non-Veg, Specialty), sorting, add to cart.
- **Interactive Pizza Builder (`/build`)**:
  - Step 1: Base (exactly 5 options).
  - Step 2: Sauce (exactly 5 options).
  - Step 3: Cheese (single selection).
  - Step 4: Vegetables (multi-select).
  - Live visual pizza stack and price calculator.
- **Cart & Checkout (`/cart`, `/checkout`)**:
  - Item listing with custom ingredient breakdowns.
  - Stock validation before checkout.
  - Order review with breakdown (Subtotal, Delivery Fee, Taxes, Total).
  - Razorpay Test Mode checkout popup.
- **Order Tracking & Dashboard (`/orders/:id`, `/dashboard`)**:
  - Visual 4-stage timeline: `Order Received` -> `In Kitchen` -> `Sent to Delivery` -> `Delivered`.
  - Real-time status updates via Socket.IO.
  - Historical order overview.

### Milestone 5: Admin Management Platform
- **Admin Authentication (`/admin/login`)**: Role-restricted access with backend token validation.
- **Admin Layout**: Persistent desktop sidebar, collapsible mobile menu, header status.
- **Admin Overview (`/admin/dashboard`)**:
  - Metric cards: Total Orders, Verified Revenue, Pending Orders, Completed Orders, Inventory Health.
  - Dynamic charts: Daily Revenue trend, Order Status distribution.
- **Inventory Management (`/admin/inventory`)**:
  - Full table with category filtering and search.
  - Real-time stock, reserved stock, and available stock.
  - Stock level adjustments, threshold settings, and manual re-stocking.
- **Order Control (`/admin/orders`)**:
  - Comprehensive order table with customer details, item breakdown, and status controls.
  - Enforced valid status transitions broadcasting Socket.IO events to target customer room.
- **Alerts & System Health (`/admin/alerts`)**:
  - Log of low-stock triggers, email notification status, and rearming mechanisms.

### Milestone 6: Testing, Browser Automation & Quality Gates
- Unit & integration tests for backend APIs using Vitest and Supertest.
- Automated end-to-end browser testing with Playwright / Puppeteer script verifying:
  - User registration & login.
  - Custom pizza building and cart flow.
  - Razorpay test mode payment verification.
  - Admin status progression and live socket reception.
- Responsive visual inspection (360px, 390px, 768px, 1024px, 1440px) with screenshots.
- Compilation of `docs/QA-REPORT.md`.

### Milestone 7: Final Delivery & Oasis Infobyte Packaging
- Root workspace documentation and README.
- Verification of `.env.example`, scripts, and clean repository structure.

