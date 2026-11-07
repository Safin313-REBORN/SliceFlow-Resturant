import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Inventory from '../models/Inventory.js';
import InventoryAlert from '../models/InventoryAlert.js';

class AdminService {
  async getDashboardAnalytics() {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({
      orderStatus: { $in: ['Order Received', 'In Kitchen', 'Sent to Delivery'] },
    });
    const completedOrders = await Order.countDocuments({ orderStatus: 'Delivered' });

    // Aggregate total verified revenue
    const revenueAgg = await Order.aggregate([
      { $match: { paymentStatus: 'PAID' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
    ]);
    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

    // Inventory metrics
    const totalInventoryItems = await Inventory.countDocuments();
    const lowStockItems = await Inventory.find({
      $expr: { $lte: ['$quantity', '$lowStockThreshold'] },
    });

    // Recent 10 orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('userId', 'name email');

    // Revenue chart data (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const revenueByDay = await Order.aggregate([
      {
        $match: {
          paymentStatus: 'PAID',
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$totalAmount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Order status breakdown
    const statusDistribution = await Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } },
    ]);

    return {
      metrics: {
        totalOrders,
        totalRevenue,
        pendingOrders,
        completedOrders,
        totalInventoryItems,
        lowStockCount: lowStockItems.length,
      },
      lowStockItems,
      recentOrders,
      charts: {
        revenueByDay,
        statusDistribution,
      },
    };
  }

  async getOrders({ page = 1, limit = 20, status, search }) {
    const query = {};
    if (status && status !== 'ALL') {
      query.orderStatus = status;
    }
    if (search) {
      const orConditions = [
        { 'customerDetails.name': { $regex: search, $options: 'i' } },
        { 'customerDetails.email': { $regex: search, $options: 'i' } },
        { razorpayOrderId: { $regex: search, $options: 'i' } },
      ];
      if (mongoose.isValidObjectId(search)) {
        orConditions.push({ _id: new mongoose.Types.ObjectId(search) });
      }
      query.$or = orConditions;
    }

    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate('userId', 'name email'),
      Order.countDocuments(query),
    ]);

    return {
      orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }
}

export default new AdminService();

