import express from 'express';
import { verifyPayment, handleWebhook } from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { paymentVerifySchema } from '../utils/validationSchemas.js';

const router = express.Router();

router.post('/verify', protect, validate(paymentVerifySchema), verifyPayment);
router.post('/webhook', handleWebhook);

export default router;

