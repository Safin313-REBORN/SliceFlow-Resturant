import express from 'express';
import {
  checkout,
  getMyOrders,
  getOrderById,
  cancelOrderPayment,
} from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { checkoutSchema } from '../utils/validationSchemas.js';

const router = express.Router();

router.post('/checkout', protect, validate(checkoutSchema), checkout);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.post('/cancel', protect, cancelOrderPayment);

export default router;

