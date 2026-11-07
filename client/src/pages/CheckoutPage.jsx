import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import Button from '../components/common/Button';
import {
  CreditCard,
  ShieldCheck,
  MapPin,
  Phone,
  AlertTriangle,
  Lock,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

const CheckoutPage = () => {
  const { user, isEmailVerified } = useAuth();
  const { cart, subtotal, discount, coupon, deliveryFee, tax, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    street: '42 Baker Street, Koramangala',
    city: 'Bengaluru',
    pincode: '560034',
    phone: '+919876543210',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [testModeModal, setTestModeModal] = useState(null); // stores order details for manual test trigger if popup blocked

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!isEmailVerified) {
      setError('Your email must be verified before placing orders. Please check your inbox or visit your dashboard.');
      return;
    }

    if (cart.length === 0) {
      navigate('/menu');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. Initialize Checkout on Backend
      const checkoutPayload = {
        items: cart.map((item) => ({
          type: item.type,
          quantity: item.quantity,
          pizzaId: item.pizzaId,
          baseId: item.baseId,
          sauceId: item.sauceId,
          cheeseId: item.cheeseId,
          vegetableIds: item.vegetableIds,
        })),
        deliveryAddress: address,
        couponCode: coupon?.code,
      };

      const res = await api.post('/orders/checkout', checkoutPayload);

      if (!res.success) {
        throw new Error(res.message || 'Failed to initiate order checkout');
      }

      const { orderId, razorpayOrderId, amount, currency, keyId } = res.data;

      // 2. Open Razorpay Modal or Fallback
      if (typeof window !== 'undefined' && window.Razorpay) {
        const options = {
          key: keyId,
          amount,
          currency,
          name: 'SliceFlow Artisanal Kitchen',
          description: `Order #${orderId.slice(-6)} Payment`,
          order_id: razorpayOrderId,
          prefill: {
            name: user?.name,
            email: user?.email,
            contact: address.phone,
          },
          theme: {
            color: '#D95732',
          },
          handler: async (response) => {
            await verifyPayment({
              orderId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
          },
          modal: {
            ondismiss: () => {
              setLoading(false);
              setTestModeModal({
                orderId,
                razorpayOrderId,
                amount,
              });
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', (resp) => {
          setError(`Payment Failed: ${resp.error?.description || 'Gateway transaction declined'}`);
          setLoading(false);
        });
        rzp.open();
      } else {
        // Fallback for sandboxed environments or adblockers
        setTestModeModal({
          orderId,
          razorpayOrderId,
          amount,
        });
        setLoading(false);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message || 'Checkout error');
      setLoading(false);
    }
  };

  const verifyPayment = async ({ orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature }) => {
    try {
      setLoading(true);
      const verifyRes = await api.post('/payments/verify', {
        orderId,
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
      });

      if (verifyRes.success) {
        // Confetti celebration!
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D95732', '#E5B75C', '#263E32'],
        });

        clearCart();
        navigate(`/orders/${orderId}`);
      } else {
        setError(verifyRes.message || 'Signature verification failed');
      }
    } catch (err) {
      setError(err.message || 'Payment verification failed');
    } finally {
      setLoading(false);
    }
  };

  // Helper for automated or test mode simulator
  const handleSimulatePaymentSuccess = async () => {
    if (!testModeModal) return;
    const testPaymentId = `pay_test_${Date.now()}`;
    await verifyPayment({
      orderId: testModeModal.orderId,
      razorpayOrderId: testModeModal.razorpayOrderId,
      razorpayPaymentId: testPaymentId,
      razorpaySignature: `test_sig_${testModeModal.orderId}`,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-1">
          Final Step
        </span>
        <h1 className="font-display font-normal text-3xl sm:text-4xl text-espresso dark:text-dark-text transition-colors">
          Secure Checkout
        </h1>
      </div>

      {/* Verification Warning Banner */}
      {!isEmailVerified && (
        <div className="bg-honey-light/70 dark:bg-honey/20 border border-honey/40 rounded-3xl p-5 flex items-start gap-4 animate-fade-in">
          <AlertTriangle className="w-6 h-6 text-forest dark:text-honey shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-display font-bold text-base text-forest dark:text-honey">
              Email Verification Required
            </h3>
            <p className="text-xs sm:text-sm text-forest/90 dark:text-dark-text mt-1">
              To safeguard orders and stock reservations, your email address (<strong>{user?.email}</strong>) must be verified before payment can be processed. Please check your inbox or visit your customer dashboard to verify.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-3xl p-4 text-xs sm:text-sm text-status-error flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-status-error shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Delivery Address Form */}
        <div className="lg:col-span-7 bg-white dark:bg-dark-card rounded-3xl border border-ivory-border dark:border-dark-border p-6 shadow-subtle space-y-6 transition-colors">
          <div className="flex items-center gap-2 pb-4 border-b border-ivory-border dark:border-dark-border">
            <MapPin className="w-5 h-5 text-primary" />
            <h2 className="font-display font-bold text-xl text-espresso dark:text-dark-text">
              Delivery Address & Contact
            </h2>
          </div>

          <form id="checkout-form" onSubmit={handleCheckout} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-espresso-muted dark:text-dark-muted mb-1">
                  Recipient Name
                </label>
                <input
                  type="text"
                  disabled
                  value={user?.name || ''}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-ivory-border dark:border-dark-border bg-ivory-soft dark:bg-dark-surface text-sm font-semibold text-espresso dark:text-dark-text"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-espresso-muted dark:text-dark-muted mb-1">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  required
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-ivory-border dark:border-dark-border text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-dark-surface text-espresso dark:text-dark-text"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-espresso-muted dark:text-dark-muted mb-1">
                Street Address & Apartment
              </label>
              <input
                type="text"
                required
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-ivory-border dark:border-dark-border text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-dark-surface text-espresso dark:text-dark-text"
                placeholder="42 Artisan Way, Floor 3"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-espresso-muted dark:text-dark-muted mb-1">
                  City
                </label>
                <input
                  type="text"
                  required
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-ivory-border dark:border-dark-border text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-dark-surface text-espresso dark:text-dark-text"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-espresso-muted dark:text-dark-muted mb-1">
                  Postal Pincode
                </label>
                <input
                  type="text"
                  required
                  value={address.pincode}
                  onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-ivory-border dark:border-dark-border text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-dark-surface text-espresso dark:text-dark-text"
                />
              </div>
            </div>
          </form>

          {/* Test Mode Fallback Simulator dialog if modal was blocked */}
          {testModeModal && (
            <div className="p-4 rounded-2xl bg-forest-light/60 dark:bg-forest/20 border border-forest/30 space-y-3 animate-fade-in">
              <div className="flex items-center gap-2 text-forest dark:text-emerald-400 font-bold text-sm">
                <CreditCard className="w-4 h-4" />
                <span>Razorpay Test Mode Order Ready: {testModeModal.razorpayOrderId}</span>
              </div>
              <p className="text-xs text-forest/90 dark:text-dark-muted">
                Razorpay test checkout initialized for ₹{(testModeModal.amount / 100).toFixed(2)}. Click below to trigger test cryptographic signature verification.
              </p>
              <Button
                variant="forest"
                size="sm"
                onClick={handleSimulatePaymentSuccess}
                loading={loading}
              >
                Complete Test Payment Verification
              </Button>
            </div>
          )}
        </div>

        {/* Right Summary & Payment CTA */}
        <div className="lg:col-span-5 bg-white dark:bg-dark-card rounded-3xl border border-ivory-border dark:border-dark-border p-6 shadow-card space-y-5 sticky top-24 transition-colors">
          <div className="flex items-center gap-2 pb-4 border-b border-ivory-border dark:border-dark-border">
            <Lock className="w-5 h-5 text-primary" />
            <h3 className="font-display font-bold text-xl text-espresso dark:text-dark-text">
              Payment & Order Items
            </h3>
          </div>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {cart.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-ivory-border dark:border-dark-border">
                <div className="truncate max-w-[200px]">
                  <span className="font-bold text-espresso dark:text-dark-text">{item.quantity}x</span>{' '}
                  <span className="text-espresso dark:text-dark-text">{item.name}</span>
                </div>
                <span className="font-semibold text-espresso dark:text-dark-text">
                  ₹{(item.unitPrice || item.basePrice) * item.quantity}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-ivory-border dark:border-dark-border space-y-2 text-xs text-espresso-muted dark:text-dark-muted">
            <div className="flex justify-between">
              <span>Item Subtotal:</span>
              <span className="font-semibold text-espresso dark:text-dark-text">₹{subtotal}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-forest dark:text-emerald-400 font-semibold animate-fade-in">
                <span>Promo Discount ({coupon?.code}):</span>
                <span>-₹{discount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery Fee:</span>
              <span className="font-semibold text-espresso dark:text-dark-text">
                {deliveryFee === 0 ? <span className="text-forest dark:text-emerald-400 font-bold">FREE</span> : `₹${deliveryFee}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>GST Tax (5%):</span>
              <span className="font-semibold text-espresso dark:text-dark-text">₹{tax}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-ivory-border dark:border-dark-border text-sm font-bold text-espresso dark:text-dark-text">
              <span>Payable Total:</span>
              <span className="text-primary text-xl font-sans font-extrabold">₹{total}</span>
            </div>
          </div>

          <Button
            type="submit"
            form="checkout-form"
            variant="gradient"
            size="lg"
            className="w-full shadow-glow"
            loading={loading}
            disabled={!isEmailVerified || cart.length === 0}
            icon={CreditCard}
          >
            Proceed to Payment (₹{total})
          </Button>

          <div className="pt-2 text-center space-y-1">
            <p className="text-[11px] text-espresso-muted dark:text-dark-muted flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-forest dark:text-emerald-400" />
              100% Encrypted Razorpay Test Gateway
            </p>
            <p className="text-[10px] text-espresso-muted dark:text-dark-muted">
              Ingredients will be atomically reserved during payment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
