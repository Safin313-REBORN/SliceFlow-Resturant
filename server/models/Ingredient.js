import mongoose from 'mongoose';

const ingredientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Ingredient name is required'],
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['base', 'sauce', 'cheese', 'vegetable'],
      index: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    priceAdjustment: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Price adjustment cannot be negative'],
    },
    image: {
      type: String,
      default: '',
    },
    isAvailable: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

ingredientSchema.index({ category: 1, isAvailable: 1 });

export default mongoose.model('Ingredient', ingredientSchema);

