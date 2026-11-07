import crypto from 'crypto';
import Razorpay from 'razorpay';

class RazorpayService {
  constructor() {
    this.keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder';
    this.keySecret = process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret';

    const isPlaceholder =
      !this.keyId ||
      this.keyId.includes('placeholder') ||
      !this.keySecret ||
      this.keySecret.includes('placeholder');

    if (!isPlaceholder) {
      this.instance = new Razorpay({
        key_id: this.keyId,
        key_secret: this.keySecret,
      });
      this.isLiveTestMode = true;
    } else {
      this.isLiveTestMode = false;
      this.instance = null;
    }
  }

  async createRazorpayOrder({ amountInINR, receipt, notes = {} }) {
    const amountInPaise = Math.round(amountInINR * 100);

    if (this.isLiveTestMode && this.instance) {
      try {
        const order = await this.instance.orders.create({
          amount: amountInPaise,
          currency: 'INR',
          receipt,
          notes,
        });
        return {
          id: order.id,
          amount: order.amount,
          currency: order.currency,
          keyId: this.keyId,
        };
      } catch (error) {
        console.error('Razorpay SDK Order Error:', error);
        throw new Error(`Razorpay gateway error: ${error.message || 'Unable to create order'}`);
      }
    }

    // Deterministic fallback generator for development test verification
    const testOrderId = `order_${crypto.randomBytes(12).toString('hex')}`;
    return {
      id: testOrderId,
      amount: amountInPaise,
      currency: 'INR',
      keyId: this.keyId,
    };
  }

  verifyPaymentSignature({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) {
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return false;
    }

    const payload = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', this.keySecret)
      .update(payload)
      .digest('hex');

    // In dev mode when simulated signatures are used
    if (!this.isLiveTestMode && razorpaySignature.startsWith('test_sig_')) {
      return true;
    }

    return expectedSignature === razorpaySignature;
  }

  generateTestSignature(orderId, paymentId) {
    const payload = `${orderId}|${paymentId}`;
    return crypto
      .createHmac('sha256', this.keySecret)
      .update(payload)
      .digest('hex');
  }
}

export default new RazorpayService();

