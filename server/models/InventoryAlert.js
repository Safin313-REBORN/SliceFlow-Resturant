import mongoose from 'mongoose';

const inventoryAlertSchema = new mongoose.Schema(
  {
    ingredientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ingredient',
      required: true,
      unique: true,
      index: true,
    },
    ingredientName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    alertStatus: {
      type: String,
      enum: ['ACTIVE', 'RESOLVED'],
      default: 'ACTIVE',
      index: true,
    },
    thresholdSnapshot: {
      type: Number,
      required: true,
    },
    stockSnapshot: {
      type: Number,
      required: true,
    },
    lastNotifiedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// High performance compound index for alert filtering and sorting
inventoryAlertSchema.index({ alertStatus: 1, lastNotifiedAt: -1 });

export default mongoose.model('InventoryAlert', inventoryAlertSchema);

