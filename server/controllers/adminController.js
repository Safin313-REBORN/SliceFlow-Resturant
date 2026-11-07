import adminService from '../services/adminService.js';
import orderService from '../services/orderService.js';
import inventoryService from '../services/inventoryService.js';
import Inventory from '../models/Inventory.js';
import Ingredient from '../models/Ingredient.js';
import InventoryAlert from '../models/InventoryAlert.js';
import Pizza from '../models/Pizza.js';

export const getDashboard = async (req, res, next) => {
  try {
    const data = await adminService.getDashboardAnalytics();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const { page, limit, status, search } = req.query;
    const result = await adminService.getOrders({ page, limit, status, search });
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;
    const io = req.app.get('io');

    const updatedOrder = await orderService.updateOrderStatus({
      orderId: id,
      nextStatus: status,
      note,
      io,
    });

    res.status(200).json({
      success: true,
      message: `Order status transitioned to ${status}`,
      data: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

export const getInventory = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const query = {};

    if (category && category !== 'All') {
      query.category = category;
    }
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const items = await Inventory.find(query).sort({ category: 1, name: 1 });
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) {
    next(error);
  }
};

export const updateInventoryItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity, lowStockThreshold, unit } = req.body;

    const item = await Inventory.findById(id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Inventory item not found' });
    }

    if (quantity !== undefined) item.quantity = Math.max(0, Number(quantity));
    if (lowStockThreshold !== undefined) item.lowStockThreshold = Math.max(1, Number(lowStockThreshold));
    if (unit) item.unit = unit;

    await item.save();

    // Re-check alerts when threshold or stock changes
    inventoryService.checkLowStockAlerts().catch(console.error);

    res.status(200).json({
      success: true,
      message: 'Inventory item updated successfully.',
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

export const addInventoryItem = async (req, res, next) => {
  try {
    const { name, category, description, priceAdjustment, initialStock, lowStockThreshold, unit } = req.body;

    // Create Ingredient first
    const ingredient = await Ingredient.create({
      name,
      category,
      description,
      priceAdjustment: Number(priceAdjustment) || 0,
      isAvailable: true,
    });

    // Create corresponding Inventory record
    const inventory = await Inventory.create({
      ingredientId: ingredient._id,
      name: ingredient.name,
      category: ingredient.category,
      quantity: Number(initialStock) || 50,
      reservedQuantity: 0,
      lowStockThreshold: Number(lowStockThreshold) || 20,
      unit: unit || 'portions',
    });

    res.status(201).json({
      success: true,
      message: 'New inventory item added successfully.',
      data: { ingredient, inventory },
    });
  } catch (error) {
    next(error);
  }
};

export const getAlerts = async (req, res, next) => {
  try {
    const alerts = await InventoryAlert.find().sort({ updatedAt: -1 });
    res.status(200).json({ success: true, count: alerts.length, data: alerts });
  } catch (error) {
    next(error);
  }
};

export const getMenuItems = async (req, res, next) => {
  try {
    const { category, search, isAvailable } = req.query;
    const query = {};

    if (category && category !== 'All') {
      query.category = category;
    }
    if (isAvailable !== undefined && isAvailable !== '') {
      query.isAvailable = isAvailable === 'true';
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const items = await Pizza.find(query).sort({ category: 1, name: 1 });
    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

export const createMenuItem = async (req, res, next) => {
  try {
    const {
      name,
      description,
      longDescription,
      image,
      category,
      basePrice,
      isAvailable,
      preparationTime,
      portionInformation,
      dietaryTags,
      allergenInformation,
      spiceLevel,
      collectionTag,
      variants,
      customizationOptions,
    } = req.body;

    const item = await Pizza.create({
      name,
      description,
      longDescription: longDescription || description,
      image: image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      category: category || 'Pizza',
      basePrice: Number(basePrice) || 0,
      isAvailable: isAvailable !== false,
      preparationTime: preparationTime || '15-20 mins',
      portionInformation: portionInformation || 'Serves 1-2',
      dietaryTags: Array.isArray(dietaryTags) ? dietaryTags : [],
      allergenInformation: Array.isArray(allergenInformation) ? allergenInformation : [],
      spiceLevel: Number(spiceLevel) || 0,
      collectionTag: collectionTag || 'none',
      variants: Array.isArray(variants) ? variants : [],
      customizationOptions: Array.isArray(customizationOptions) ? customizationOptions : [],
    });

    res.status(201).json({
      success: true,
      message: 'Menu item created successfully.',
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    const item = await Pizza.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!item) {
      return res.status(404).json({ success: false, message: 'Menu item not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Menu item updated successfully.',
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await Pizza.findByIdAndDelete(id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Menu item not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Menu item deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};


