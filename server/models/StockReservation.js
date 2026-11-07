import mongoose from 'mongoose';

const reservationItemSchema = new mongoose.Schema(
  {
    ingredientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ingredient',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false }
);

const stockReservationSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
      index: true,
    },
    items: [reservationItemSchema],
    status: {
      type: String,
      enum: ['PENDING', 'COMMITTED', 'RELEASED'],
      default: 'PENDING',
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// High performance compound indexes for reservation lookup & cron cleanup
stockReservationSchema.index({ status: 1, expiresAt: 1 });
stockReservationSchema.index({ orderId: 1, status: 1 });

export default mongoose.model('StockReservation', stockReservationSchema);

