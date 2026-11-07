import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema(
  {
    ingredientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ingredient',
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['base', 'sauce', 'cheese', 'vegetable'],
      index: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 100,
      min: [0, 'Quantity cannot be negative'],
    },
    reservedQuantity: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Reserved quantity cannot be negative'],
    },
    lowStockThreshold: {
      type: Number,
      required: true,
      default: 20,
      min: [1, 'Threshold must be at least 1'],
    },
    unit: {
      type: String,
      default: 'portions',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for real-time available stock
inventorySchema.virtual('availableQuantity').get(function () {
  return Math.max(0, this.quantity - this.reservedQuantity);
});

// Performance compound indexes
inventorySchema.index({ category: 1, quantity: 1 });
inventorySchema.index({ quantity: 1, lowStockThreshold: 1 });

export default mongoose.model('Inventory', inventorySchema);

