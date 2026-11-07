import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Pizza from '../models/Pizza.js';
import Ingredient from '../models/Ingredient.js';
import inventoryService from './inventoryService.js';
import razorpayService from './razorpayService.js';

class OrderService {
  /**
   * Authoritative calculation and checkout initialization
   */
  async processCheckout({ userId, customerDetails, items, couponCode }) {
    if (!items || items.length === 0) {
      const error = new Error('Your cart is empty.');
      error.statusCode = 400;
      throw error;
    }

    let subtotal = 0;
    const computedOrderItems = [];
    const requiredIngredientAggregator = new Map(); // ingredientId -> totalQuantityNeeded

    // Process each line item with strict backend pricing
    for (const item of items) {
      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);

      if (item.type === 'standard') {
        const pizza = await Pizza.findById(item.pizzaId).populate('recipe.ingredientId');
        if (!pizza || !pizza.isAvailable) {
          const error = new Error(`Pizza "${item.name || 'Selected'}" is currently unavailable.`);
          error.statusCode = 400;
          throw error;
        }

        const linePrice = pizza.basePrice * qty;
        subtotal += linePrice;

        computedOrderItems.push({
          type: 'standard',
          pizzaId: pizza._id,
          name: pizza.name,
          quantity: qty,
          unitPrice: pizza.basePrice,
          totalPrice: linePrice,
        });

        // Tally required ingredients from recipe
        for (const recipeItem of pizza.recipe) {
          const ingId = recipeItem.ingredientId?._id?.toString() || recipeItem.ingredientId?.toString();
          if (ingId) {
            const needed = (recipeItem.quantityRequired || 1) * qty;
            requiredIngredientAggregator.set(
              ingId,
              (requiredIngredientAggregator.get(ingId) || 0) + needed
            );
          }
        }
      } else if (item.type === 'custom') {
        // Pizza Builder requirements:
        // Must have 1 Base, 1 Sauce, 1 Cheese, and 0 or more Veggies
        const { baseId, sauceId, cheeseId, vegetableIds = [] } = item;

        if (!baseId || !sauceId || !cheeseId) {
          const error = new Error('Custom pizzas require a Base, a Sauce, and a Cheese selection.');
          error.statusCode = 400;
          throw error;
        }

        const base = await Ingredient.findById(baseId);
        const sauce = await Ingredient.findById(sauceId);
        const cheese = await Ingredient.findById(cheeseId);

        if (!base || base.category !== 'base' || !base.isAvailable) {
          throw new Error('Selected pizza base is invalid or unavailable.');
        }
        if (!sauce || sauce.category !== 'sauce' || !sauce.isAvailable) {
          throw new Error('Selected pizza sauce is invalid or unavailable.');
        }
        if (!cheese || cheese.category !== 'cheese' || !cheese.isAvailable) {
          throw new Error('Selected cheese is invalid or unavailable.');
        }

        let customUnitPrice = 199; // Base handcrafted custom pizza starter price
        customUnitPrice += base.priceAdjustment || 0;
        customUnitPrice += sauce.priceAdjustment || 0;
        customUnitPrice += cheese.priceAdjustment || 0;

        const vegSnapshots = [];
        for (const vegId of vegetableIds) {
          const veg = await Ingredient.findById(vegId);
          if (veg && veg.category === 'vegetable' && veg.isAvailable) {
            customUnitPrice += veg.priceAdjustment || 0;
            vegSnapshots.push({
              id: veg._id,
              name: veg.name,
              priceAdjustment: veg.priceAdjustment,
            });

            // Tally veg
            const vId = veg._id.toString();
            requiredIngredientAggregator.set(
              vId,
              (requiredIngredientAggregator.get(vId) || 0) + qty
            );
          }
        }

        // Tally base, sauce, cheese
        const bId = base._id.toString();
        const sId = sauce._id.toString();
        const cId = cheese._id.toString();

        requiredIngredientAggregator.set(bId, (requiredIngredientAggregator.get(bId) || 0) + qty);
        requiredIngredientAggregator.set(sId, (requiredIngredientAggregator.get(sId) || 0) + qty);
        requiredIngredientAggregator.set(cId, (requiredIngredientAggregator.get(cId) || 0) + qty);

        const linePrice = customUnitPrice * qty;
        subtotal += linePrice;

        computedOrderItems.push({
          type: 'custom',
          name: `Custom Pizza (${base.name})`,
          quantity: qty,
          unitPrice: customUnitPrice,
          totalPrice: linePrice,
          customization: {
            base: { id: base._id, name: base.name, priceAdjustment: base.priceAdjustment },
            sauce: { id: sauce._id, name: sauce.name, priceAdjustment: sauce.priceAdjustment },
            cheese: { id: cheese._id, name: cheese.name, priceAdjustment: cheese.priceAdjustment },
            vegetables: vegSnapshots,
          },
        });
      }
    }

    let discount = 0;
    let deliveryFee = 40; // Flat INR 40 delivery
    let appliedCoupon = '';

    if (couponCode) {
      const code = couponCode.trim().toUpperCase();
      if (code === 'SLICE10') {
        discount = Math.round(subtotal * 0.10);
        appliedCoupon = 'SLICE10 (10% OFF)';
      } else if (code === 'OASIS50') {
        discount = Math.min(subtotal, 50);
        appliedCoupon = 'OASIS50 (₹50 OFF)';
      } else if (code === 'FREEDEL') {
        deliveryFee = 0;
        appliedCoupon = 'FREEDEL (Free Delivery)';
      }
    }

    const discountedSubtotal = Math.max(0, subtotal - discount);
    const tax = Math.round(discountedSubtotal * 0.05); // 5% GST
    const totalAmount = discountedSubtotal + deliveryFee + tax;

    // Convert required ingredients map to array
    const reservationItems = Array.from(requiredIngredientAggregator.entries()).map(
      ([ingredientId, quantity]) => ({
        ingredientId: new mongoose.Types.ObjectId(ingredientId),
        quantity,
      })
    );

    // Create Internal Order document
    const order = await Order.create({
      userId,
      customerDetails,
      orderItems: computedOrderItems,
      subtotal,
      discount,
      couponCode: appliedCoupon,
      deliveryFee,
      tax,
      totalAmount,
      paymentStatus: 'PENDING',
      orderStatus: 'Order Received',
      statusHistory: [
        {
          status: 'Order Received',
          timestamp: new Date(),
          note: 'Checkout initiated, awaiting payment verification.',
        },
      ],
    });

    // Execute Two-Phase Stock Reservation
    await inventoryService.reserveStock(reservationItems, order._id);

    // Create Razorpay Order
    const razorpayOrder = await razorpayService.createRazorpayOrder({
      amountInINR: totalAmount,
      receipt: `rcpt_${order._id.toString().slice(-8)}`,
      notes: { internalOrderId: order._id.toString(), userId: userId.toString() },
    });

    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    return {
      orderId: order._id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      razorpayOrderId: razorpayOrder.id,
      keyId: razorpayOrder.keyId,
      subtotal,
      deliveryFee,
      tax,
      totalAmount,
    };
  }

  /**
   * Finalize order on successful payment verification
   */
  async verifyAndFinalizePayment({ orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature, io }) {
    const order = await Order.findById(orderId);
    if (!order) {
      const error = new Error('Order not found.');
      error.statusCode = 404;
      throw error;
    }

    // Idempotency check: if already paid, return safely
    if (order.paymentStatus === 'PAID') {
      return { success: true, message: 'Order has already been verified and paid.', order };
    }

    // Verify cryptographic signature
    const isValid = razorpayService.verifyPaymentSignature({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });

    if (!isValid) {
      order.paymentStatus = 'FAILED';
      await order.save();
      // Release reserved stock back to pool
      await inventoryService.releaseReservation(order._id);
      const error = new Error('Payment signature verification failed. Possible tampering detected.');
      error.statusCode = 400;
      throw error;
    }

    // Commit physical stock deduction
    await inventoryService.commitReservation(order._id);

    // Update order state
    order.paymentStatus = 'PAID';
    order.razorpayPaymentId = razorpayPaymentId;
    order.razorpaySignature = razorpaySignature;
    order.orderStatus = 'Order Received';
    order.statusHistory.push({
      status: 'Order Received',
      timestamp: new Date(),
      note: 'Payment captured successfully. Order sent to kitchen.',
    });
    await order.save();

    // Broadcast live event via Socket.IO if available
    if (io) {
      const payload = {
        orderId: order._id,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        statusHistory: order.statusHistory,
      };
      io.to(`user_${order.userId.toString()}`).emit('order:status_updated', payload);
      io.to(`order_${order._id.toString()}`).emit('order:status_updated', payload);
    }

    return { success: true, message: 'Payment verified and order confirmed!', order };
  }

  /**
   * Handle checkout cancellation or failure
   */
  async handlePaymentFailure(orderId) {
    const order = await Order.findById(orderId);
    if (order && order.paymentStatus === 'PENDING') {
      order.paymentStatus = 'FAILED';
      await order.save();
      await inventoryService.releaseReservation(order._id);
    }
    return { success: true, message: 'Reservation released.' };
  }

  /**
   * Admin Status Transition with state machine enforcement
   */
  async updateOrderStatus({ orderId, nextStatus, note = '', io }) {
    const validTransitions = {
      'Order Received': ['In Kitchen', 'Cancelled'],
      'In Kitchen': ['Sent to Delivery', 'Cancelled'],
      'Sent to Delivery': ['Delivered', 'Cancelled'],
      'Delivered': [],
      'Cancelled': [],
    };

    const order = await Order.findById(orderId);
    if (!order) {
      const error = new Error('Order not found.');
      error.statusCode = 404;
      throw error;
    }

    const currentStatus = order.orderStatus;
    const allowed = validTransitions[currentStatus] || [];

    if (!allowed.includes(nextStatus)) {
      const error = new Error(
        `Invalid status transition from "${currentStatus}" to "${nextStatus}". Allowed: ${allowed.join(', ') || 'None'}`
      );
      error.statusCode = 400;
      throw error;
    }

    order.orderStatus = nextStatus;
    order.statusHistory.push({
      status: nextStatus,
      timestamp: new Date(),
      note: note || `Status updated to ${nextStatus}`,
    });
    await order.save();

    // Broadcast to customer room and dedicated order room
    if (io) {
      const payload = {
        orderId: order._id,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        statusHistory: order.statusHistory,
        updatedAt: new Date(),
      };
      io.to(`user_${order.userId.toString()}`).emit('order:status_updated', payload);
      io.to(`order_${order._id.toString()}`).emit('order:status_updated', payload);
    }

    return order;
  }
}

export default new OrderService();

