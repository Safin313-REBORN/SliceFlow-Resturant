import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(60),
    email: z.string().email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/\d/, 'Password must contain at least one number'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Please enter a valid email address'),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Reset token is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/\d/, 'Password must contain at least one number'),
  }),
});

export const checkoutSchema = z.object({
  body: z.object({
    items: z
      .array(
        z.object({
          type: z.enum(['standard', 'custom']),
          quantity: z.number().int().min(1),
          pizzaId: z.string().optional(),
          name: z.string().optional(),
          baseId: z.string().optional(),
          sauceId: z.string().optional(),
          cheeseId: z.string().optional(),
          vegetableIds: z.array(z.string()).optional(),
        })
      )
      .min(1, 'Cart cannot be empty'),
    deliveryAddress: z.object({
      street: z.string().min(3, 'Street address is required'),
      city: z.string().min(2, 'City is required'),
      pincode: z.string().min(4, 'Valid postal code is required'),
      phone: z.string().min(10, 'Valid phone number is required'),
    }),
    couponCode: z.string().optional(),
  }),
});

export const paymentVerifySchema = z.object({
  body: z.object({
    orderId: z.string().min(1, 'Order ID is required'),
    razorpayOrderId: z.string().min(1, 'Razorpay Order ID is required'),
    razorpayPaymentId: z.string().min(1, 'Razorpay Payment ID is required'),
    razorpaySignature: z.string().min(1, 'Razorpay signature is required'),
  }),
});

export const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.enum([
      'Order Received',
      'In Kitchen',
      'Sent to Delivery',
      'Delivered',
      'Cancelled',
    ]),
    note: z.string().optional(),
  }),
});

