import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['standard', 'custom'],
      required: true,
    },
    pizzaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pizza',
    },
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    customization: {
      base: { id: mongoose.Schema.Types.ObjectId, name: String, priceAdjustment: Number },
      sauce: { id: mongoose.Schema.Types.ObjectId, name: String, priceAdjustment: Number },
      cheese: { id: mongoose.Schema.Types.ObjectId, name: String, priceAdjustment: Number },
      vegetables: [
        { id: mongoose.Schema.Types.ObjectId, name: String, priceAdjustment: Number },
      ],
    },
  },
  { _id: true }
);

const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      enum: ['Order Received', 'In Kitchen', 'Sent to Delivery', 'Delivered', 'Cancelled'],
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    note: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    customerDetails: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    orderItems: [orderItemSchema],
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    couponCode: {
      type: String,
      default: '',
    },
    deliveryFee: {
      type: Number,
      required: true,
      default: 40,
    },
    tax: {
      type: Number,
      required: true,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'],
      default: 'PENDING',
      index: true,
    },
    orderStatus: {
      type: String,
      enum: ['Order Received', 'In Kitchen', 'Sent to Delivery', 'Delivered', 'Cancelled'],
      default: 'Order Received',
      index: true,
    },
    razorpayOrderId: {
      type: String,
      index: { sparse: true, unique: true },
    },
    razorpayPaymentId: {
      type: String,
      index: { sparse: true },
    },
    razorpaySignature: {
      type: String,
    },
    estimatedDeliveryMinutes: {
      type: Number,
      default: 35,
    },
    statusHistory: [statusHistorySchema],
  },
  {
    timestamps: true,
  }
);

// High performance compound query indexes
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1, createdAt: -1 });
orderSchema.index({ paymentStatus: 1, createdAt: -1 });

export default mongoose.model('Order', orderSchema);

