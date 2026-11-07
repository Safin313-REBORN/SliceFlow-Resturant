import { MOCK_CATALOG, MOCK_BUILDER_OPTIONS, MOCK_USER, MOCK_ADMIN_USER } from './mockData';

export const getMockFallback = (url, method = 'get', requestData = null) => {
  const cleanUrl = url.split('?')[0];
  const queryStr = url.includes('?') ? url.split('?')[1] : '';
  const searchParams = new URLSearchParams(queryStr);

  // 1. Pizzas & Catalog
  if (cleanUrl.endsWith('/pizzas') && method === 'get') {
    let list = [...MOCK_CATALOG];
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const dietary = searchParams.get('dietary');
    const sort = searchParams.get('sort');

    if (category && category !== 'All') {
      list = list.filter((item) => item.category?.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (item) => item.name?.toLowerCase().includes(q) || item.description?.toLowerCase().includes(q)
      );
    }

    if (dietary && dietary !== 'All') {
      list = list.filter((item) =>
        item.dietaryTags?.some((t) => t.toLowerCase() === dietary.toLowerCase())
      );
    }

    if (sort === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sort === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return { success: true, count: list.length, data: list };
  }

  // 2. Pizza Builder Options
  if (cleanUrl.includes('/pizza-builder/options') && method === 'get') {
    return { success: true, data: MOCK_BUILDER_OPTIONS };
  }

  // 3. User Authentication
  if (cleanUrl.endsWith('/auth/me') && method === 'get') {
    const saved = localStorage.getItem('sliceflow_demo_user');
    if (saved) {
      try {
        return { success: true, data: { user: JSON.parse(saved) } };
      } catch (e) {}
    }
    return { success: false, data: null };
  }

  if (cleanUrl.endsWith('/auth/login') && method === 'post') {
    let payload = requestData;
    if (typeof payload === 'string') {
      try { payload = JSON.parse(payload); } catch (e) {}
    }
    const isMasterAdmin = payload?.email?.includes('admin');
    const targetUser = isMasterAdmin ? MOCK_ADMIN_USER : MOCK_USER;
    localStorage.setItem('sliceflow_demo_user', JSON.stringify(targetUser));
    return { success: true, message: 'Logged in successfully', data: { user: targetUser, token: 'demo-jwt-token' } };
  }

  if (cleanUrl.endsWith('/auth/admin-login') && method === 'post') {
    localStorage.setItem('sliceflow_demo_user', JSON.stringify(MOCK_ADMIN_USER));
    return { success: true, message: 'Admin logged in', data: { user: MOCK_ADMIN_USER, token: 'demo-admin-jwt' } };
  }

  if (cleanUrl.endsWith('/auth/register') && method === 'post') {
    let payload = requestData;
    if (typeof payload === 'string') {
      try { payload = JSON.parse(payload); } catch (e) {}
    }
    const newUser = {
      _id: 'usr_' + Date.now(),
      name: payload?.name || 'Demo Customer',
      email: payload?.email || 'customer@sliceflow.com',
      role: 'customer',
      isEmailVerified: true,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('sliceflow_demo_user', JSON.stringify(newUser));
    return { success: true, message: 'Registration completed', data: { user: newUser, token: 'demo-jwt-token' } };
  }

  if (cleanUrl.endsWith('/auth/logout') && method === 'post') {
    localStorage.removeItem('sliceflow_demo_user');
    return { success: true, message: 'Logged out successfully' };
  }

  // 4. Checkout & Order Verification
  if (cleanUrl.endsWith('/orders/checkout') && method === 'post') {
    const demoId = 'ord_' + Math.random().toString(36).substring(2, 8);
    return {
      success: true,
      data: {
        orderId: demoId,
        razorpayOrderId: 'order_demo_' + Date.now(),
        amount: 85000,
        currency: 'INR',
        keyId: 'rzp_test_mock',
      },
    };
  }

  if (cleanUrl.endsWith('/payments/verify') && method === 'post') {
    return {
      success: true,
      message: 'Demo payment simulated and finalized successfully.',
      data: { orderId: 'ord_demo_live_01' },
    };
  }

  // 5. Order Tracking & History
  if (cleanUrl.endsWith('/orders/my-orders') && method === 'get') {
    return {
      success: true,
      count: 1,
      data: [
        {
          _id: 'ord_demo_live_01',
          orderStatus: 'In Kitchen',
          paymentStatus: 'PAID',
          totalAmount: 850,
          createdAt: new Date().toISOString(),
          items: [
            { name: 'Classic Margherita', quantity: 1, finalPrice: 420 },
            { name: 'Loaded Cheese Fries', quantity: 1, finalPrice: 220 },
          ],
        },
      ],
    };
  }

  if (cleanUrl.includes('/orders/') && method === 'get') {
    const parts = cleanUrl.split('/orders/');
    const id = parts[1] || 'ord_demo_live_01';
    return {
      success: true,
      data: {
        _id: id,
        orderStatus: 'In Kitchen',
        paymentStatus: 'PAID',
        totalAmount: 850,
        createdAt: new Date().toISOString(),
        items: [
          { name: 'Classic Margherita', quantity: 1, finalPrice: 420 },
          { name: 'Loaded Cheese Fries', quantity: 1, finalPrice: 220 },
        ],
      },
    };
  }

  // 6. Admin Panel Endpoints
  if (cleanUrl.endsWith('/admin/dashboard') && method === 'get') {
    return {
      success: true,
      data: {
        todayOrdersCount: 28,
        todayRevenue: 24650,
        activeOrdersCount: 5,
        lowStockCount: 2,
        orderStatusCounts: {
          'Order Received': 2,
          'In Kitchen': 3,
          'Sent to Delivery': 4,
          Delivered: 19,
        },
        dailyRevenueChart: [
          { date: 'Mon', revenue: 18200 },
          { date: 'Tue', revenue: 21400 },
          { date: 'Wed', revenue: 19800 },
          { date: 'Thu', revenue: 23100 },
          { date: 'Fri', revenue: 28900 },
          { date: 'Sat', revenue: 34500 },
          { date: 'Sun', revenue: 24650 },
        ],
      },
    };
  }

  if (cleanUrl.endsWith('/admin/orders') && method === 'get') {
    return {
      success: true,
      count: 3,
      data: [
        {
          _id: 'ord_demo_101',
          orderStatus: 'In Kitchen',
          paymentStatus: 'PAID',
          totalAmount: 950,
          customer: { name: 'Elena Rostova', email: 'customer@sliceflow.com' },
          createdAt: new Date().toISOString(),
          items: [{ name: 'Classic Margherita', quantity: 2, finalPrice: 840 }],
        },
        {
          _id: 'ord_demo_102',
          orderStatus: 'Order Received',
          paymentStatus: 'PAID',
          totalAmount: 620,
          customer: { name: 'Dev Sharma', email: 'dev@example.com' },
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          items: [{ name: 'Loaded Cheese Fries', quantity: 2, finalPrice: 440 }],
        },
      ],
    };
  }

  if (cleanUrl.endsWith('/admin/inventory') && method === 'get') {
    return {
      success: true,
      count: 5,
      data: [
        { _id: 'inv_1', name: 'Hand-Tossed Classic Crust', category: 'base', quantity: 85, reservedQuantity: 2, availableQuantity: 83, safetyThreshold: 20 },
        { _id: 'inv_2', name: 'San Marzano Tomato Marinara', category: 'sauce', quantity: 120, reservedQuantity: 3, availableQuantity: 117, safetyThreshold: 25 },
        { _id: 'inv_3', name: 'Fior di Latte Mozzarella', category: 'cheese', quantity: 15, reservedQuantity: 4, availableQuantity: 11, safetyThreshold: 20 },
        { _id: 'inv_4', name: 'Sweet Red Bell Peppers', category: 'vegetable', quantity: 45, reservedQuantity: 1, availableQuantity: 44, safetyThreshold: 15 },
        { _id: 'inv_5', name: 'Button Mushrooms', category: 'vegetable', quantity: 8, reservedQuantity: 2, availableQuantity: 6, safetyThreshold: 10 },
      ],
    };
  }

  if (cleanUrl.endsWith('/admin/alerts') && method === 'get') {
    return {
      success: true,
      count: 2,
      data: [
        { _id: 'alt_1', ingredientName: 'Button Mushrooms', currentStock: 6, threshold: 10, isArmed: true, createdAt: new Date().toISOString() },
        { _id: 'alt_2', ingredientName: 'Fior di Latte Mozzarella', currentStock: 11, threshold: 20, isArmed: true, createdAt: new Date().toISOString() },
      ],
    };
  }

  if (cleanUrl.endsWith('/admin/menu') && method === 'get') {
    return {
      success: true,
      count: MOCK_CATALOG.length,
      data: MOCK_CATALOG,
    };
  }

  return undefined;
};

