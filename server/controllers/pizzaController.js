import Pizza from '../models/Pizza.js';
import Ingredient from '../models/Ingredient.js';

export const getPizzas = async (req, res, next) => {
  try {
    const {
      category,
      search,
      sort,
      collectionTag,
      isFeatured,
      isBestseller,
      dietary,
      spiceLevel,
      minPrice,
      maxPrice,
    } = req.query;

    const query = { isAvailable: true };

    if (category && category !== 'All') {
      // Map legacy categories if needed
      if (category === 'Veg') {
        query.dietaryTags = { $in: ['Vegetarian', 'Veg'] };
      } else if (category === 'Non-Veg') {
        query.dietaryTags = { $in: ['Non-Veg'] };
      } else {
        query.category = category;
      }
    }

    if (collectionTag && collectionTag !== 'all') {
      query.collectionTag = collectionTag;
    }

    if (isFeatured === 'true') {
      query.isFeatured = true;
    }

    if (isBestseller === 'true') {
      query.isBestseller = true;
    }

    if (spiceLevel !== undefined && spiceLevel !== '') {
      query.spiceLevel = Number(spiceLevel);
    }

    if (dietary) {
      query.dietaryTags = { $in: [dietary] };
    }

    if (minPrice || maxPrice) {
      query.basePrice = {};
      if (minPrice) query.basePrice.$gte = Number(minPrice);
      if (maxPrice) query.basePrice.$lte = Number(maxPrice);
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { longDescription: { $regex: search, $options: 'i' } },
        { dietaryTags: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'price_asc') sortOptions = { basePrice: 1 };
    if (sort === 'price_desc') sortOptions = { basePrice: -1 };
    if (sort === 'name_asc') sortOptions = { name: 1 };
    if (sort === 'rating_desc' || sort === 'popular') sortOptions = { rating: -1, ratingCount: -1 };

    const pizzas = await Pizza.find(query).sort(sortOptions);

    res.status(200).json({
      success: true,
      count: pizzas.length,
      data: pizzas,
    });
  } catch (error) {
    next(error);
  }
};

export const getPizzaById = async (req, res, next) => {
  try {
    const pizza = await Pizza.findById(req.params.id).populate('recipe.ingredientId');
    if (!pizza) {
      return res.status(404).json({ success: false, message: 'Item not found in menu' });
    }
    res.status(200).json({ success: true, data: pizza });
  } catch (error) {
    next(error);
  }
};

export const getPizzaBuilderOptions = async (req, res, next) => {
  try {
    const ingredients = await Ingredient.find().sort({ priceAdjustment: 1, name: 1 });

    const bases = ingredients.filter((i) => i.category === 'base');
    const sauces = ingredients.filter((i) => i.category === 'sauce');
    const cheeses = ingredients.filter((i) => i.category === 'cheese');
    const vegetables = ingredients.filter((i) => i.category === 'vegetable');

    res.status(200).json({
      success: true,
      data: {
        bases,
        sauces,
        cheeses,
        vegetables,
      },
    });
  } catch (error) {
    next(error);
  }
};
