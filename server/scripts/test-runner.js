import http from 'http';
import { app, server } from '../server.js';
import { connectDB, closeDB } from '../config/db.js';
import { seedDatabase } from './seed.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import Inventory from '../models/Inventory.js';
import Ingredient from '../models/Ingredient.js';
import razorpayService from '../services/razorpayService.js';

let testPort = 5055;
let baseUrl = `http://localhost:${testPort}/api`;
let httpServer;

const request = async (endpoint, options = {}) => {
  const url = `${baseUrl}${endpoint}`;
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const res = await fetch(url, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  const cookieHeader = res.headers.get('set-cookie');
  return { status: res.status, data, headers: res.headers, cookie: cookieHeader };
};

const runBackendTests = async () => {
  console.log('🧪 Starting SliceFlow Automated Backend Integration Test Suite...\n');

  await connectDB();
  const userCount = await User.countDocuments();
  if (userCount === 0) {
    await seedDatabase();
  }

  httpServer = server.listen(testPort);
  await new Promise((r) => setTimeout(r, 500));

  let passed = 0;
  let failed = 0;

  const assert = (condition, description) => {
    if (condition) {
      console.log(`  ✅ PASS: ${description}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${description}`);
      failed++;
    }
  };

  try {
    // Test 1: Health Check
    console.log('--- Test Group 1: Server & System Health ---');
    const health = await request('/health');
    assert(health.status === 200 && health.data.status === 'healthy', 'GET /api/health returns 200 with status "healthy"');

    // Test 2: Pizza Menu & Builder Options
    console.log('\n--- Test Group 2: Catalog & Pizza Builder ---');
    const pizzasRes = await request('/pizzas');
    assert(pizzasRes.status === 200 && pizzasRes.data.data.length >= 6, `GET /api/pizzas returns catalog with ${pizzasRes.data.data?.length} pizzas`);

    const optionsRes = await request('/pizza-builder/options');
    assert(optionsRes.status === 200, 'GET /api/pizza-builder/options returns 200');
    assert(optionsRes.data.data.bases.length === 5, `Builder has EXACTLY 5 bases (found: ${optionsRes.data.data.bases.length})`);
    assert(optionsRes.data.data.sauces.length === 5, `Builder has EXACTLY 5 sauces (found: ${optionsRes.data.data.sauces.length})`);
    assert(optionsRes.data.data.cheeses.length >= 1, `Builder has cheeses available (found: ${optionsRes.data.data.cheeses.length})`);
    assert(optionsRes.data.data.vegetables.length >= 4, `Builder has vegetables available (found: ${optionsRes.data.data.vegetables.length})`);

    // Test 3: Authentication & Verification Gate
    console.log('\n--- Test Group 3: Customer Auth & Verification ---');
    const testEmail = `test_user_${Date.now()}@example.com`;
    const regRes = await request('/auth/register', {
      method: 'POST',
      body: { name: 'Test QA User', email: testEmail, password: 'Password123' },
    });
    assert(regRes.status === 201 && regRes.data.success, 'POST /api/auth/register creates user (status 201)');

    const dupReg = await request('/auth/register', {
      method: 'POST',
      body: { name: 'Test QA User', email: testEmail, password: 'Password123' },
    });
    assert(dupReg.status === 409, 'Duplicate registration is rejected with 409 Conflict');

    // Test unverified user checkout block
    const unverifiedUser = await User.findOne({ email: testEmail });
    assert(unverifiedUser.isEmailVerified === false, 'Newly registered user email is initially unverified');

    // Simulate email verification by updating flag or using token
    unverifiedUser.isEmailVerified = true;
    await unverifiedUser.save();

    const loginRes = await request('/auth/login', {
      method: 'POST',
      body: { email: testEmail, password: 'Password123' },
    });
    assert(loginRes.status === 200 && loginRes.data.data.token, 'POST /api/auth/login succeeds and returns JWT token');
    const customerToken = loginRes.data.data.token;

    // Test 4: Custom Pizza Ordering & Two-Phase Reservation
    console.log('\n--- Test Group 4: Pizza Customization & Stock Reservation ---');
    const baseId = optionsRes.data.data.bases[0]._id;
    const sauceId = optionsRes.data.data.sauces[0]._id;
    const cheeseId = optionsRes.data.data.cheeses[0]._id;
    const vegIds = [optionsRes.data.data.vegetables[0]._id, optionsRes.data.data.vegetables[1]._id];

    // Check inventory before checkout
    const initialBaseInv = await Inventory.findOne({ ingredientId: baseId });
    const initialReserved = initialBaseInv.reservedQuantity;

    const checkoutRes = await request('/orders/checkout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: {
        items: [
          {
            type: 'custom',
            quantity: 1,
            baseId,
            sauceId,
            cheeseId,
            vegetableIds: vegIds,
          },
        ],
        deliveryAddress: {
          street: '100 Tech Park',
          city: 'Bengaluru',
          pincode: '560100',
          phone: '+919876543210',
        },
      },
    });

    assert(checkoutRes.status === 201 && checkoutRes.data.data.razorpayOrderId, 'POST /api/orders/checkout reserves stock & generates Razorpay order');
    const { orderId, razorpayOrderId, totalAmount } = checkoutRes.data.data;

    // Verify stock reservation updated
    const afterReserveBaseInv = await Inventory.findOne({ ingredientId: baseId });
    assert(afterReserveBaseInv.reservedQuantity === initialReserved + 1, 'Two-Phase reservation atomically incremented reservedQuantity by 1');

    // Test 5: Razorpay Payment Verification & Inventory Commit
    console.log('\n--- Test Group 5: Payment Signature Verification & Inventory Commit ---');
    const testPaymentId = `pay_test_${Date.now()}`;
    const validSignature = razorpayService.generateTestSignature(razorpayOrderId, testPaymentId);

    // Test bad signature
    const badPayRes = await request('/payments/verify', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: {
        orderId,
        razorpayOrderId,
        razorpayPaymentId: testPaymentId,
        razorpaySignature: 'tampered_invalid_signature_xyz',
      },
    });
    assert(badPayRes.status === 400, 'Tampered Razorpay signature is rejected with 400 Bad Request');

    // Re-reserve or use valid signature
    const validPayRes = await request('/payments/verify', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: {
        orderId,
        razorpayOrderId,
        razorpayPaymentId: testPaymentId,
        razorpaySignature: validSignature,
      },
    });
    assert(validPayRes.status === 200 && validPayRes.data.success, 'Valid Razorpay signature confirms order and transitions paymentStatus to PAID');

    const confirmedOrder = await Order.findById(orderId);
    assert(confirmedOrder.paymentStatus === 'PAID', 'Order record updated to paymentStatus: "PAID"');
    assert(confirmedOrder.orderStatus === 'Order Received', 'Order initialized with orderStatus: "Order Received"');

    // Test 6: Admin Operations & Order Status Progression
    console.log('\n--- Test Group 6: Admin Management & Status Transitions ---');
    const adminLoginRes = await request('/auth/admin-login', {
      method: 'POST',
      body: { email: 'admin@sliceflow.com', password: 'AdminSecurePassword123!' },
    });
    assert(adminLoginRes.status === 200 && adminLoginRes.data.data.user.role === 'admin', 'POST /api/auth/admin-login authenticates admin account');
    const adminToken = adminLoginRes.data.data.token;

    const dashRes = await request('/admin/dashboard', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(dashRes.status === 200 && dashRes.data.data.metrics.totalOrders >= 1, 'GET /api/admin/dashboard returns aggregated metrics & revenue');

    // Admin updates order status: Order Received -> In Kitchen
    const statusUpdateRes = await request(`/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { status: 'In Kitchen', note: 'Baking in stone hearth oven' },
    });
    assert(statusUpdateRes.status === 200 && statusUpdateRes.data.data.orderStatus === 'In Kitchen', 'PATCH /api/admin/orders/:id/status updates status to "In Kitchen"');

    // Test invalid transition (cannot jump from In Kitchen to Delivered)
    const invalidTransitionRes = await request(`/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { status: 'Delivered' },
    });
    assert(invalidTransitionRes.status === 400, 'Invalid status transition jump rejected with 400 Bad Request');

    // Advance properly: In Kitchen -> Sent to Delivery -> Delivered
    await request(`/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { status: 'Sent to Delivery' },
    });
    const finalDeliveredRes = await request(`/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { status: 'Delivered' },
    });
    assert(finalDeliveredRes.status === 200 && finalDeliveredRes.data.data.orderStatus === 'Delivered', 'Order successfully advanced to "Delivered"');

    // Test 7: Inventory Management & Low Stock Thresholds
    console.log('\n--- Test Group 7: Inventory Control & Threshold Alerts ---');
    const invRes = await request('/admin/inventory', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(invRes.status === 200 && invRes.data.data.length >= 20, `GET /api/admin/inventory returns ${invRes.data.data?.length} tracked stock items`);

    console.log('\n======================================================');
    console.log(`📊 TEST SUITE SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log('======================================================\n');

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Fatal Test Runner Exception:', err);
    process.exit(1);
  } finally {
    httpServer.close();
    await closeDB();
    process.exit(0);
  }
};

runBackendTests();
