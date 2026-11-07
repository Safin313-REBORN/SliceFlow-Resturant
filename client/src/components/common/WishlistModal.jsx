import React from 'react';
import { useCart } from '../../contexts/CartContext';
import { X, Heart, ShoppingBag, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from './Button';

const WishlistModal = ({ isOpen, onClose }) => {
  const { wishlist, toggleWishlist, addToCart } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-espresso/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div
        className="relative w-full max-w-md bg-white dark:bg-dark-card rounded-3xl shadow-modal overflow-hidden border border-ivory-border dark:border-dark-border p-6 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-ivory-border dark:border-dark-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary-light dark:bg-primary/20 flex items-center justify-center text-primary">
              <Heart className="w-4 h-4 fill-current" />
            </div>
            <h3 className="font-display font-bold text-xl text-espresso dark:text-dark-text">Your Saved Favorites</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close saved favorites modal"
            className="w-11 h-11 rounded-full bg-ivory-soft dark:bg-dark-surface hover:bg-ivory-border dark:hover:bg-dark-border text-espresso dark:text-dark-text flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {wishlist.length === 0 ? (
          <div className="py-12 text-center">
            <Heart className="w-12 h-12 text-ivory-border dark:text-dark-border mx-auto mb-3" />
            <h4 className="font-display font-bold text-lg text-espresso dark:text-dark-text mb-1">No favorites saved yet</h4>
            <p className="text-xs text-espresso-muted dark:text-dark-muted mb-5">
              Click the heart icon on any pizza, burger, pasta, or dessert to save it here for later.
            </p>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={onClose}
            >
              Explore Menu
            </Button>
          </div>
        ) : (
          <div className="py-4 space-y-3 max-h-[60vh] overflow-y-auto">
            {wishlist.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between p-3 rounded-2xl bg-ivory-soft dark:bg-dark-surface border border-ivory-border dark:border-dark-border gap-3"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-14 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-espresso dark:text-dark-text truncate">{item.name}</h4>
                  <p className="text-xs font-extrabold text-primary mt-0.5">₹{item.basePrice}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      addToCart({
                        type: 'standard',
                        pizzaId: item._id,
                        name: item.name,
                        basePrice: item.basePrice,
                        unitPrice: item.basePrice,
                        quantity: 1,
                        image: item.image,
                        category: item.category,
                      });
                    }}
                    className="p-2 rounded-xl bg-primary text-white hover:bg-primary-hover transition-colors active:scale-95 cursor-pointer"
                    title="Add to cart"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleWishlist(item)}
                    className="p-2 rounded-xl bg-white dark:bg-dark-card text-espresso-muted hover:text-status-error transition-colors border border-ivory-border dark:border-dark-border active:scale-95 cursor-pointer"
                    title="Remove from favorites"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {wishlist.length > 0 && (
          <div className="pt-3 border-t border-ivory-border dark:border-dark-border flex justify-end">
            <Link to="/cart" onClick={onClose}>
              <Button variant="gradient" size="sm" icon={ShoppingBag}>
                Go to Bag ({wishlist.length})
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistModal;
