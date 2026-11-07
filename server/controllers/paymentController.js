import orderService from '../services/orderService.js';
import razorpayService from '../services/razorpayService.js';
import Order from '../models/Order.js';

export const verifyPayment = async (req, res, next) => {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    const io = req.app.get('io');

    const result = await orderService.verifyAndFinalizePayment({
      orderId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      io,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const handleWebhook = async (req, res, next) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (webhookSecret && signature) {
      // Validate webhook signature if configured
      const crypto = await import('crypto');
      const expected = crypto
        .createHmac('sha256', webhookSecret)
        .update(JSON.stringify(req.body))
        .digest('hex');

      if (expected !== signature) {
        return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
      }
    }

    const event = req.body.event;
    console.log(`Razorpay Webhook Event Received: ${event}`);

    if (event === 'payment.captured') {
      const paymentEntity = req.body.payload?.payment?.entity;
      const rzpOrderId = paymentEntity?.order_id;
      if (rzpOrderId) {
        const order = await Order.findOne({ razorpayOrderId: rzpOrderId });
        if (order && order.paymentStatus !== 'PAID') {
          const io = req.app.get('io');
          await orderService.verifyAndFinalizePayment({
            orderId: order._id,
            razorpayOrderId: rzpOrderId,
            razorpayPaymentId: paymentEntity.id,
            razorpaySignature: 'webhook_verified',
            io,
          });
        }
      }
    }

    res.status(200).json({ status: 'ok' });
  } catch (error) {
    next(error);
  }
};

