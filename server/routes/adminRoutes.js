import express from 'express';
import {
  getDashboard,
  getOrders,
  updateOrderStatus,
  getInventory,
  updateInventoryItem,
  addInventoryItem,
  getAlerts,
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from '../controllers/adminController.js';
import { protect, restrictTo } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { updateOrderStatusSchema } from '../utils/validationSchemas.js';

const router = express.Router();

// Require authenticated administrator for all routes
router.use(protect, restrictTo('admin'));

router.get('/dashboard', getDashboard);
router.get('/orders', getOrders);
router.patch('/orders/:id/status', validate(updateOrderStatusSchema), updateOrderStatus);

router.get('/inventory', getInventory);
router.post('/inventory', addInventoryItem);
router.patch('/inventory/:id', updateInventoryItem);

router.get('/alerts', getAlerts);

// Menu Catalogue Management
router.get('/menu', getMenuItems);
router.post('/menu', createMenuItem);
router.patch('/menu/:id', updateMenuItem);
router.delete('/menu/:id', deleteMenuItem);

export default router;

