# 🍕 SliceFlow-Resturant: Premium Full-Stack Pizza Delivery & Inventory Management Platform

> **Oasis Infobyte Internship: Web Development & Designing**  
> **Level:** Level 3, Task 1 (Full-Stack Web Application)  
> **Development Framework:** Production Full-Stack Engineering (MERN + Real-Time)  
> **Target Stack:** React.js + Node.js + Express.js + MongoDB + Razorpay Test Mode + Socket.IO + Tailwind CSS  
> **🌐 Live GitHub Pages Demo:** [https://safin313-reborn.github.io/SliceFlow-Resturant/](https://safin313-reborn.github.io/SliceFlow-Resturant/)  

---

## 🌟 Executive Overview

**SliceFlow** is a commercial-grade, full-stack pizza ordering and real-time kitchen inventory management system. Unlike static demonstrations or basic tutorial projects, SliceFlow is engineered as an integrated web application featuring:

- **Interactive 4-Step Pizza Builder**: A multi-step customization engine offering exactly 5 artisan crust bases, 5 freshly simmered sauces, melted cheeses, and farm-fresh vegetables with real-time visual stack rendering and authoritative server-calculated pricing.
- **Two-Phase Atomic Stock Reservation**: Concurrency control preventing overselling and race conditions during simultaneous checkouts through conditional atomic locking (`$expr: { $gte: [...] }`) and transactional stock commits upon payment verification.
- **Razorpay Test Mode Integration**: Server-authoritative order creation in paise, cryptographic HMAC-SHA256 signature verification, webhook security, and idempotent payment processing.
- **Live Real-Time Order Tracking**: Authenticated WebSocket connections via Socket.IO providing live status progression (`Order Received` → `In Kitchen` → `Sent to Delivery` → `Delivered`) directly to the customer's visual timeline.
- **Dedicated Kitchen Administration Center**: Role-based access control (`role: 'admin'`), operations analytics, dynamic revenue trajectory charts, real-time inventory ledger adjustments, safety threshold controls, and automated cron-driven low-stock email alerts.

---

## 📸 Interface Showcase

| Screen | Viewport | Key Capabilities Verified |
| :--- | :---: | :--- |
| **[Homepage](screenshots/01-homepage.png)** | 1440x900 | Hero section, editorial photography, featured pizzas, why choose SliceFlow, how it works, and testimonials |
| **[Homepage (Mobile)](screenshots/01-homepage-mobile.png)** | 390x844 | Responsive drawer navigation, zero horizontal overflow, touch-friendly hit targets (≥44px) |
| **[Pizza Menu Catalogue](screenshots/02-pizza-menu.png)** | 1440x900 | Category filters (Veg, Non-Veg, Specialty), live search, price sorting, and responsive cards |
| **[Pizza Builder - Step 1](screenshots/03-pizza-builder-step1-crust.png)** | 1440x900 | Exactly 5 artisan crust bases with price adjustments and live visualizer |
| **[Pizza Builder - Step 2](screenshots/03-pizza-builder-step2-sauce.png)** | 1440x900 | Exactly 5 gourmet simmered sauces with individual flavor notes |
| **[Pizza Builder - Step 3](screenshots/03-pizza-builder-step3-cheese.png)** | 1440x900 | Italian cheeses (Fior di Latte, Aged Cheddar, Smoked Provolone, Plant-Based) |
| **[Pizza Builder - Step 4](screenshots/03-pizza-builder-step4-veggies.png)** | 1440x900 | Multi-select fresh toppings with dynamic live price computation |
| **[Shopping Cart](screenshots/04-cart.png)** | 1440x900 | Customized recipe breakdowns, item quantities, subtotal, flat delivery, and 5% GST tax |
| **[Customer Checkout](screenshots/07-checkout.png)** | 1440x900 | Delivery address form, verification check, and Razorpay test payment modal |
| **[Live Order Tracking](screenshots/08-order-tracking.png)** | 1440x900 | 4-Stage visual timeline with live pulse indicator and real-time Socket.IO sync |
| **[Customer Dashboard](screenshots/09-customer-dashboard.png)** | 1440x900 | Lifetime order history, active kitchen orders, and email verification badge |
| **[Admin Dashboard](screenshots/11-admin-dashboard.png)** | 1440x900 | Operations analytics, verified revenue metrics, daily trajectory chart, and status breakdown |
| **[Admin Order Control](screenshots/12-admin-orders.png)** | 1440x900 | Queue management table and sequential status transition controls |
| **[Admin Inventory Ledger](screenshots/13-admin-inventory.png)** | 1440x900 | Real-time physical, reserved, and available stock with modal adjustment controls |
| **[Admin Low-Stock Alerts](screenshots/14-admin-alerts.png)** | 1440x900 | Threshold safety monitoring log, email trigger records, and automatic re-arming status |

---

## 🛠️ Architecture & Technology Stack

```
SliceFlow/
├── client/                     # Frontend Application (React 18 + Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/         # Reusable UI primitives, Pizza cards, Builder, Modals
│   │   ├── contexts/           # AuthContext, CartContext, SocketContext
│   │   ├── layouts/            # CustomerLayout, AdminLayout
│   │   ├── pages/              # 14 complete customer, admin, and authentication pages
│   │   └── services/           # Axios network layer with credential interceptors
│   └── dist/                   # Production-compiled bundle
│
├── server/                     # Backend API & Real-Time Engine (Node.js + Express)
│   ├── config/                 # Database connection & replica set auto-provisioner
│   ├── models/                 # Mongoose schemas (User, Pizza, Ingredient, Inventory, Order...)
│   ├── controllers/            # Request handlers and response mapping
│   ├── routes/                 # REST routing declarations with Zod validation
│   ├── middleware/             # Helmet, CORS, RateLimit, Auth, ErrorHandler
│   ├── services/               # Core business services (Auth, Razorpay, Inventory, Order, Email)
│   ├── sockets/                # Authenticated Socket.IO hub with room-based isolation
│   ├── jobs/                   # node-cron jobs for low-stock alarms & reservation cleanup
│   └── scripts/                # Database seeder, integration test runner, browser E2E test
│
├── .agents/skills/             # Workspace skills governing engineering discipline
├── docs/                       # Implementation plan, system architecture, database schema, API docs, QA
├── screenshots/                # 19 high-resolution full-page visual audit screenshots
├── .env.example                # Sanitized template for environment configuration
└── package.json                # Monorepo orchestration scripts
```

### Technology Highlights

| Domain | Technology | Implementation Detail |
| :--- | :--- | :--- |
| **Frontend** | React 18 + Vite | SPA architecture with React Router DOM v7, modular context state, and bundle optimization |
| **Styling** | Tailwind CSS | Custom SliceFlow design tokens: Tomato Red (`#E84736`), Warm Cream (`#FFF8EF`), Charcoal (`#202124`) |
| **Backend** | Express.js + Node.js | Controller-Service-Repository pattern, ES Modules, centralized error handling |
| **Database** | MongoDB + Mongoose | Embedded Replica Set with ACID multi-document transactions & atomic conditional locking |
| **Security** | Helmet, Bcrypt, JWT | HTTP-only session cookies, 10-round bcrypt password hashing, token hashing with SHA-256 |
| **Payments** | Razorpay Test Mode | Server-side order creation in paise, cryptographic HMAC-SHA256 signature verification |
| **Real-Time** | Socket.IO | Handshake JWT authentication, private user rooms (`user_${id}`), zero data leakage across customers |
| **Automation** | node-cron + Nodemailer | Scheduled reservation release every 5m, automated low-stock monitoring with rearming logic |
| **Testing** | Puppeteer + Google Chrome | 38 automated test cases covering backend APIs and end-to-end browser journeys |

---

## ⚡ Quick Start & Running Locally

### Prerequisites
- **Node.js**: v18+ (tested on Node v22.23.4)
- **npm**: v9+ (tested on npm 10.9.9)
- **Browser**: Google Chrome, Chromium, or modern evergreen browser

### 1. Installation
Clone or navigate to the project directory:
```bash
cd OIBSIP/WebDev-L3-PizzaDelivery
```

Install server and client dependencies:
```bash
npm run install:all
```

### 2. Environment Configuration
Copy the template configuration:
```bash
cp .env.example server/.env
```
*(Default test settings are pre-configured. No external MongoDB cluster is required: an integrated MongoDB replica set boots automatically!)*

### 3. Seed Database
Seed standard signature pizzas, exactly 5 bases, 5 sauces, cheeses, vegetables, inventory ledger, and default credentials:
```bash
npm run seed
```

**Default Seeded Credentials:**
- **Admin Portal (`/admin/login`):**
  - Email: `admin@sliceflow.com`
  - Password: `AdminSecurePassword123!`
- **Demo Customer (`/login`):**
  - Email: `customer@sliceflow.com`
  - Password: `Customer123!`

### 4. Launch Application
To launch the backend API and frontend dev server:
```bash
# Terminal 1: Start Backend API & Real-Time Engine (Port 5000)
npm run dev:server

# Terminal 2: Start Frontend Application (Port 5173)
npm run dev:client
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser!

Or to run the compiled production build directly:
```bash
npm start
```
Open **[http://localhost:5000](http://localhost:5000)**!

---

## 🧪 Test Suite & Verification

SliceFlow includes an automated integration test suite and headless browser automation runner:

```bash
# Run 23 automated backend integration tests (Auth, Catalog, Concurrency, Razorpay HMAC, Admin)
npm run test:server

# Run End-to-End Browser Journey & Screenshot Generation with Google Chrome
cd server && node scripts/e2e-browser-test.js
```

**Test Results Summary:**
- **38 / 38 Tests Passing (100% Success Rate)**
- Detailed QA evidence documented in **[`docs/QA-REPORT.md`](docs/QA-REPORT.md)**.

---

## 📚 Complete Project Documentation

- **[`docs/IMPLEMENTATION-PLAN.md`](docs/IMPLEMENTATION-PLAN.md)**: Phased milestones and delivery gates.
- **[`docs/SYSTEM-ARCHITECTURE.md`](docs/SYSTEM-ARCHITECTURE.md)**: Tier diagrams, network layout, and Socket.IO topology.
- **[`docs/DATABASE-SCHEMA.md`](docs/DATABASE-SCHEMA.md)**: Complete Mongoose schema data dictionary and indexing strategy.
- **[`docs/API-DOCUMENTATION.md`](docs/API-DOCUMENTATION.md)**: REST API request/response specifications.
- **[`docs/SECURITY-PLAN.md`](docs/SECURITY-PLAN.md)**: Threat modeling, defense-in-depth, and concurrency blueprints.
- **[`docs/TEST-PLAN.md`](docs/TEST-PLAN.md)**: QA test strategy and verification criteria.
- **[`docs/QA-REPORT.md`](docs/QA-REPORT.md)**: Full execution logs and quality gate clearance certificate.
- **[`docs/SKILL-USAGE.md`](docs/SKILL-USAGE.md)**: Engineering methodology and skill activation report.

---

## 📄 License & Oasis Infobyte Submission Notice

This repository represents the completed submission for:
**Oasis Infobyte Internship Program: Web Development and Designing, Level 3 Task 1.**  
Developed with precision, security, and architectural integrity.

