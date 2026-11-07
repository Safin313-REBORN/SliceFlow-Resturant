import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useCart } from '../contexts/CartContext';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import CompleteYourMeal from '../components/food/CompleteYourMeal';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Pizza,
  Tag,
  Check,
  X,
} from 'lucide-react';

const CartPage = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItemCount,
    subtotal,
    discount,
    coupon,
    applyCoupon,
    removeCoupon,
    deliveryFee,
    tax,
    total,
  } = useCart();
  const navigate = useNavigate();

  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState(null);

  const handleApplyCoupon = (e, explicitCode) => {
    if (e) e.preventDefault();
    const code = explicitCode || couponInput;
    const res = applyCoupon(code);
    setCouponMessage(res);
    if (res.success) {
      setCouponInput('');
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Your Shopping Cart is Empty"
          description="Looks like you haven't added any handcrafted pizzas yet. Explore our signature catalogue or design your own masterpiece!"
          actionText="Browse Menu"
          actionLink="/menu"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-ivory-border dark:border-dark-border gap-2">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-1">
            Order Review
          </span>
          <h1 className="font-display font-normal text-3xl sm:text-4xl text-espresso dark:text-dark-text transition-colors">
            Shopping Cart ({totalItemCount} {totalItemCount === 1 ? 'item' : 'items'})
          </h1>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="text-xs font-bold text-status-error hover:underline self-start sm:self-auto cursor-pointer"
        >
          Clear entire cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => {
            const unitPrice = item.unitPrice || item.basePrice || 0;
            const lineTotal = unitPrice * (item.quantity || 1);

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-dark-card rounded-3xl border border-ivory-border dark:border-dark-border p-4 sm:p-5 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
              >
                {/* Item Details */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-ivory-soft dark:bg-dark-surface border border-ivory-border dark:border-dark-border overflow-hidden shrink-0 flex items-center justify-center">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Pizza className="w-8 h-8 text-primary" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                          item.type === 'custom'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-300'
                            : 'bg-forest-light text-forest dark:bg-forest/20 dark:text-emerald-400'
                        }`}
                      >
                        {item.type === 'custom' ? 'Custom Crafted' : 'Signature'}
                      </span>
                      <span className="text-xs text-espresso-muted dark:text-dark-muted font-sans font-bold">
                        ₹{unitPrice} each
                      </span>
                    </div>

                    <h3 className="font-sans font-bold text-base sm:text-lg text-espresso dark:text-dark-text mt-1 truncate">
                      {item.name}
                    </h3>

                    {/* Custom Pizza Ingredients breakdown */}
                    {item.type === 'custom' && item.customization && (
                      <div className="text-xs text-espresso-muted dark:text-dark-muted mt-1 space-y-0.5 font-sans">
                        <p>
                          <strong className="text-espresso dark:text-dark-text">Base:</strong>{' '}
                          {item.customization.base?.name}
                        </p>
                        <p>
                          <strong className="text-espresso dark:text-dark-text">Sauce:</strong>{' '}
                          {item.customization.sauce?.name}
                        </p>
                        <p>
                          <strong className="text-espresso dark:text-dark-text">Cheese:</strong>{' '}
                          {item.customization.cheese?.name}
                        </p>
                        {item.customization.vegetables?.length > 0 && (
                          <p>
                            <strong className="text-espresso dark:text-dark-text">Toppings:</strong>{' '}
                            {item.customization.vegetables.map((v) => v.name).join(', ')}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Standard customized item details */}
                    {item.type === 'standard' && (item.selectedVariant || (item.selectedCustomizations && item.selectedCustomizations.length > 0)) && (
                      <div className="text-xs text-espresso-muted dark:text-dark-muted mt-1 space-y-0.5 font-sans">
                        {item.selectedVariant && (
                          <p><strong className="text-espresso dark:text-dark-text">Size:</strong> {item.selectedVariant}</p>
                        )}
                        {item.selectedCustomizations && item.selectedCustomizations.length > 0 && (
                          <p><strong className="text-espresso dark:text-dark-text">Add-ons:</strong> {item.selectedCustomizations.join(', ')}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Quantity Controls & Line Price */}
                <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-ivory-border dark:border-dark-border">
                  <div className="flex items-center gap-2 border border-ivory-border dark:border-dark-border rounded-2xl p-1 bg-ivory-soft dark:bg-dark-surface">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                      className="w-7 h-7 rounded-xl flex items-center justify-center text-espresso dark:text-dark-text hover:bg-white dark:hover:bg-dark-card transition-colors active:scale-90 cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-espresso dark:text-dark-text">
                      {item.quantity || 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                      className="w-7 h-7 rounded-xl flex items-center justify-center text-espresso dark:text-dark-text hover:bg-white dark:hover:bg-dark-card transition-colors active:scale-90 cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="font-sans font-extrabold text-xl text-espresso dark:text-dark-text w-20 text-right">
                    ₹{lineTotal}
                  </span>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 rounded-xl text-espresso-muted hover:text-status-error hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Complete Your Meal cross-selling suggestions */}
          <CompleteYourMeal />
        </div>

        {/* Order Summary Card */}
        <div className="lg:col-span-4 bg-white dark:bg-dark-card rounded-3xl border border-ivory-border dark:border-dark-border p-6 shadow-card space-y-5 sticky top-24 transition-colors">
          <h3 className="font-display font-bold text-xl text-espresso dark:text-dark-text pb-4 border-b border-ivory-border dark:border-dark-border">
            Order Summary
          </h3>

          {/* Promo Code Box */}
          <div className="space-y-2 pt-1">
            <span className="text-xs font-bold uppercase tracking-wider text-espresso dark:text-dark-text flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-primary" />
              Promo Code
            </span>

            {coupon ? (
              <div className="flex items-center justify-between p-3 bg-forest-light dark:bg-forest/20 border border-forest/30 rounded-2xl text-xs text-forest dark:text-emerald-400 animate-fade-in">
                <div>
                  <span className="font-bold font-mono">{coupon.code}</span>
                  <p className="text-[11px] opacity-80">{coupon.description}</p>
                </div>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="p-1 rounded-lg text-forest dark:text-emerald-400 hover:bg-forest/20 transition-colors cursor-pointer"
                  title="Remove coupon"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="e.g. SLICE10"
                    className="flex-1 px-3 py-2 rounded-xl border border-ivory-border dark:border-dark-border text-xs uppercase font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-primary bg-ivory-soft dark:bg-dark-surface text-espresso dark:text-dark-text"
                  />
                  <Button variant="outline" size="sm" type="submit" disabled={!couponInput.trim()}>
                    Apply
                  </Button>
                </div>
                {/* Promo Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {['SLICE10', 'OASIS50', 'FREEDEL'].map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => handleApplyCoupon(null, code)}
                      className="px-2 py-0.5 rounded-lg bg-ivory-soft dark:bg-dark-surface border border-ivory-border dark:border-dark-border text-[10px] font-mono font-semibold text-espresso dark:text-dark-text hover:border-primary hover:text-primary transition-all cursor-pointer"
                    >
                      {code}
                    </button>
                  ))}
                </div>
              </form>
            )}

            {couponMessage && (
              <p
                className={`text-[11px] font-medium ${
                  couponMessage.success ? 'text-forest dark:text-emerald-400' : 'text-status-error'
                } animate-fade-in`}
              >
                {couponMessage.message}
              </p>
            )}
          </div>

          <div className="space-y-3 text-sm text-espresso-muted dark:text-dark-muted pt-3 border-t border-ivory-border dark:border-dark-border">
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
                {deliveryFee === 0 ? (
                  <span className="text-forest dark:text-emerald-400 font-bold">FREE</span>
                ) : (
                  `₹${deliveryFee}`
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Taxes (5% GST):</span>
              <span className="font-semibold text-espresso dark:text-dark-text">₹{tax}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-ivory-border dark:border-dark-border flex items-center justify-between">
            <span className="font-display font-bold text-base text-espresso dark:text-dark-text">
              Final Total
            </span>
            <span className="font-sans font-extrabold text-2xl text-primary">
              ₹{total}
            </span>
          </div>

          <Button
            variant="gradient"
            size="lg"
            className="w-full shadow-glow"
            onClick={() => navigate('/checkout')}
            icon={ArrowRight}
            iconPosition="right"
          >
            Proceed to Checkout
          </Button>

          <div className="pt-2 text-center">
            <span className="text-[11px] text-espresso-muted dark:text-dark-muted inline-flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-forest dark:text-emerald-400" />
              Secured with Razorpay & 2-Phase Stock Reservation
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
