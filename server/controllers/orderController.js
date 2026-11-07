import orderService from '../services/orderService.js';
import Order from '../models/Order.js';

export const checkout = async (req, res, next) => {
  try {
    // Constraint: unverified users cannot checkout
    if (!req.user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email address before placing an order. A verification link was sent to your inbox.',
      });
    }

    const { items, deliveryAddress, couponCode } = req.body;
    const customerDetails = {
      name: req.user.name,
      email: req.user.email,
      phone: deliveryAddress.phone,
      street: deliveryAddress.street,
      city: deliveryAddress.city,
      pincode: deliveryAddress.pincode,
    };

    const checkoutData = await orderService.processCheckout({
      userId: req.user._id,
      customerDetails,
      items,
      couponCode,
    });

    res.status(201).json({
      success: true,
      message: 'Checkout initialized. Razorpay order generated.',
      data: checkoutData,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Object-level authorization check
    if (
      order.userId.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You cannot view orders belonging to another customer.',
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelOrderPayment = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const result = await orderService.handlePaymentFailure(orderId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

