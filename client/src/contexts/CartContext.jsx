import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('sliceflow_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('sliceflow_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [coupon, setCoupon] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('sliceflow_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to sync cart to localStorage:', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('sliceflow_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to sync wishlist to localStorage:', e);
    }
  }, [wishlist]);

  const toggleWishlist = (item) => {
    setWishlist((prev) => {
      const exists = prev.some((w) => w._id === item._id);
      if (exists) {
        return prev.filter((w) => w._id !== item._id);
      } else {
        return [...prev, item];
      }
    });
  };

  const isWishlisted = (itemId) => {
    return wishlist.some((w) => w._id === itemId);
  };

  const applyCoupon = (code) => {
    const trimmed = (code || '').trim().toUpperCase();
    if (trimmed === 'SLICE10') {
      setCoupon({ code: 'SLICE10', description: '10% Off Entire Order', type: 'percent', value: 0.10 });
      return { success: true, message: 'SLICE10 applied! 10% off your entire order.' };
    } else if (trimmed === 'OASIS50') {
      setCoupon({ code: 'OASIS50', description: '₹50 Flat Discount', type: 'flat', value: 50 });
      return { success: true, message: 'OASIS50 applied! ₹50 deducted from your subtotal.' };
    } else if (trimmed === 'FREEDEL') {
      setCoupon({ code: 'FREEDEL', description: 'Free Delivery', type: 'freedel', value: 40 });
      return { success: true, message: 'FREEDEL applied! Delivery fee waived.' };
    } else {
      return { success: false, message: 'Invalid promo code. Try SLICE10, OASIS50, or FREEDEL.' };
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
  };

  const addToCart = (item) => {
    setCart((prev) => {
      // If plain standard item with no special customizations, increment quantity
      const isPlainStandard =
        item.type === 'standard' &&
        !item.selectedVariant &&
        (!item.selectedCustomizations || item.selectedCustomizations.length === 0);

      if (isPlainStandard) {
        const existingIdx = prev.findIndex(
          (p) =>
            p.type === 'standard' &&
            p.pizzaId === item.pizzaId &&
            !p.selectedVariant &&
            (!p.selectedCustomizations || p.selectedCustomizations.length === 0)
        );
        if (existingIdx > -1) {
          const updated = [...prev];
          updated[existingIdx].quantity += item.quantity || 1;
          return updated;
        }
      }

      // Otherwise append as distinct cart entry
      return [
        ...prev,
        {
          ...item,
          id: `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          quantity: item.quantity || 1,
        },
      ];
    });
  };

  const updateQuantity = (itemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const removeFromCart = (itemId) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItemCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const wishlistCount = wishlist.length;

  const subtotal = cart.reduce((sum, item) => {
    const unit = item.unitPrice || item.basePrice || 0;
    return sum + unit * (item.quantity || 1);
  }, 0);

  let discount = 0;
  let deliveryFee = cart.length > 0 ? 40 : 0;

  if (coupon) {
    if (coupon.type === 'percent') {
      discount = Math.round(subtotal * coupon.value);
    } else if (coupon.type === 'flat') {
      discount = Math.min(subtotal, coupon.value);
    } else if (coupon.type === 'freedel') {
      deliveryFee = 0;
    }
  }

  const discountedSubtotal = Math.max(0, subtotal - discount);
  const tax = Math.round(discountedSubtotal * 0.05);
  const total = discountedSubtotal + deliveryFee + tax;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItemCount,
        wishlist,
        wishlistCount,
        toggleWishlist,
        isWishlisted,
        subtotal,
        discount,
        coupon,
        applyCoupon,
        removeCoupon,
        deliveryFee,
        tax,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
