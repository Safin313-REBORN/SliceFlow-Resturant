import mongoose from 'mongoose';

const recipeItemSchema = new mongoose.Schema(
  {
    ingredientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ingredient',
      required: true,
    },
    quantityRequired: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },
  },
  { _id: false }
);

const variantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    priceMultiplier: { type: Number, default: 1.0 },
  },
  { _id: false }
);

const customizationOptionSchema = new mongoose.Schema(
  {
    groupName: { type: String, required: true },
    type: { type: String, enum: ['radio', 'checkbox'], default: 'checkbox' },
    required: { type: Boolean, default: false },
    options: [
      {
        name: { type: String, required: true },
        price: { type: Number, default: 0 },
      },
    ],
  },
  { _id: false }
);

const pizzaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Item name is required'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    longDescription: {
      type: String,
      trim: true,
      default: '',
    },
    image: {
      type: String,
      required: [true, 'Image URL or path is required'],
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Pizza',
        'Burgers',
        'Pasta',
        'Sides',
        'Desserts',
        'Drinks',
        'Combos',
        // Legacy / Filter compatibility
        'Veg',
        'Non-Veg',
        'Specialty',
        'Beverages',
      ],
      index: true,
    },
    basePrice: {
      type: Number,
      required: true,
      min: [0, 'Base price cannot be negative'],
    },
    isAvailable: {
      type: Boolean,
      default: true,
      index: true,
    },
    preparationTime: {
      type: String,
      default: '15-20 mins',
    },
    portionInformation: {
      type: String,
      default: 'Serves 1-2 • 350g',
    },
    dietaryTags: {
      type: [String],
      default: [],
    },
    allergenInformation: {
      type: [String],
      default: [],
    },
    spiceLevel: {
      type: Number,
      min: 0,
      max: 3,
      default: 0,
    },
    rating: {
      type: Number,
      default: 4.8,
    },
    ratingCount: {
      type: Number,
      default: 142,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isBestseller: {
      type: Boolean,
      default: false,
    },
    collectionTag: {
      type: String,
      enum: ['chefs_special', 'most_loved', 'new_on_menu', 'weekend_special', 'family_favorites', 'none'],
      default: 'none',
    },
    variants: [variantSchema],
    customizationOptions: [customizationOptionSchema],
    recipe: [recipeItemSchema],
  },
  {
    timestamps: true,
  }
);

pizzaSchema.index({ category: 1, isAvailable: 1 });
pizzaSchema.index({ isAvailable: 1, basePrice: 1 });
pizzaSchema.index({ collectionTag: 1, isAvailable: 1 });

export default mongoose.model('Pizza', pizzaSchema);
