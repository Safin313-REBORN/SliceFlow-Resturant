import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import {
  X,
  Star,
  Clock,
  Flame,
  Check,
  Plus,
  Minus,
  Heart,
  ShoppingBag,
  Sparkles,
  Info,
} from 'lucide-react';

const FALLBACK_FOOD_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23F1E9DE'/%3E%3Ctext x='50%25' y='46%25' font-size='44' text-anchor='middle' dominant-baseline='middle'%3E🍕%3C/text%3E%3Ctext x='50%25' y='68%25' font-family='sans-serif' font-size='13' font-weight='700' fill='%2383766D' text-anchor='middle'%3ESliceFlow Artisan Kitchen%3C/text%3E%3C/svg%3E";

const ProductDetailsModal = ({ item, isOpen, onClose }) => {
  const { addToCart, isWishlisted, toggleWishlist } = useCart();

  if (!isOpen || !item) return null;

  // Selected variant
  const [selectedVariant, setSelectedVariant] = useState(() => {
    if (item.variants && item.variants.length > 0) {
      return item.variants[0];
    }
    return null;
  });

  // Selected customizations: map of { optionName: price }
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const handleToggleAddon = (addon) => {
    setSelectedAddons((prev) => {
      const exists = prev.find((a) => a.name === addon.name);
      if (exists) {
        return prev.filter((a) => a.name !== addon.name);
      } else {
        return [...prev, addon];
      }
    });
  };

  // Base calculation
  const currentBasePrice = selectedVariant ? selectedVariant.price : item.basePrice;
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + (a.price || 0), 0);
  const unitPrice = currentBasePrice + addonsTotal;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    addToCart({
      type: 'standard',
      pizzaId: item._id,
      name: item.name,
      image: item.image,
      category: item.category,
      basePrice: unitPrice,
      unitPrice: unitPrice,
      quantity: quantity,
      selectedVariant: selectedVariant ? selectedVariant.name : undefined,
      selectedCustomizations: selectedAddons.map((a) => a.name),
    });

    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 700);
  };

  const wishlisted = isWishlisted(item._id);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-espresso/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div
        className="relative w-full max-w-3xl bg-white dark:bg-dark-card rounded-3xl shadow-modal overflow-hidden border border-ivory-border dark:border-dark-border flex flex-col md:flex-row max-h-[92vh] animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-11 h-11 rounded-full bg-white/90 dark:bg-dark-surface/90 backdrop-blur-md text-espresso dark:text-dark-text hover:bg-white dark:hover:bg-dark-card hover:text-primary transition-all flex items-center justify-center shadow-md focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Photography & Visual Badges */}
        <div className="md:w-1/2 relative bg-ivory-soft dark:bg-dark-surface min-h-[260px] md:min-h-full flex items-center justify-center overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            width="400"
            height="380"
            className="w-full h-full object-cover object-center max-h-[380px] md:max-h-full hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = FALLBACK_FOOD_IMG;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-espresso/40 via-transparent to-transparent md:hidden" />

          {/* Category Pill */}
          <span className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-forest text-white shadow-md">
            {item.category}
          </span>

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={() => toggleWishlist(item)}
            className={`absolute bottom-4 left-4 z-10 w-11 h-11 rounded-full flex items-center justify-center shadow-md transition-all cursor-pointer ${
              wishlisted
                ? 'bg-primary text-white scale-110'
                : 'bg-white/90 dark:bg-dark-surface/90 backdrop-blur-md text-espresso dark:text-dark-text hover:text-primary hover:bg-white'
            }`}
            aria-label="Save to favorites"
          >
            <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Right Side: Details, Customization & Ordering */}
        <div className="md:w-1/2 p-6 sm:p-7 flex flex-col justify-between overflow-y-auto max-h-[60vh] md:max-h-[90vh]">
          <div className="space-y-4">
            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="flex items-center gap-1 text-honey">
                  <Star className="w-4 h-4 fill-honey" />
                  <span className="text-xs font-bold text-espresso dark:text-dark-text">{item.rating || 4.8}</span>
                </div>
                <span className="text-xs text-espresso-muted dark:text-dark-muted">({item.ratingCount || 120} reviews)</span>
                <span className="text-xs text-espresso-muted dark:text-dark-muted">•</span>
                <div className="flex items-center gap-1 text-espresso-muted dark:text-dark-muted text-xs">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{item.preparationTime || '15-20 mins'}</span>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-display font-bold text-espresso dark:text-dark-text tracking-tight">
                {item.name}
              </h2>

              <p className="text-xl sm:text-2xl font-sans font-extrabold text-primary mt-1">
                ₹{unitPrice}
                {item.variants && item.variants.length > 0 && (
                  <span className="text-xs text-espresso-muted dark:text-dark-muted font-normal ml-1.5">
                    ({selectedVariant?.name || 'Selected size'})
                  </span>
                )}
              </p>
            </div>

            {/* Description */}
            <p className="text-sm text-espresso-muted dark:text-dark-muted leading-relaxed">
              {item.longDescription || item.description}
            </p>

            {/* Portion & Attributes */}
            <div className="flex flex-wrap gap-2 text-xs">
              {item.portionInformation && (
                <span className="px-2.5 py-1 rounded-md bg-ivory-soft dark:bg-dark-surface text-espresso dark:text-dark-text font-medium border border-ivory-border dark:border-dark-border">
                  {item.portionInformation}
                </span>
              )}
              {item.spiceLevel > 0 && (
                <span className="px-2.5 py-1 rounded-md bg-red-50 dark:bg-red-950/40 text-status-error font-medium flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  {item.spiceLevel === 1 ? 'Mild Spice' : item.spiceLevel === 2 ? 'Medium Heat' : 'Fiery Hot'}
                </span>
              )}
              {item.dietaryTags?.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-md bg-forest-light dark:bg-forest/20 text-forest dark:text-emerald-400 font-semibold"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Variants Selector */}
            {item.variants && item.variants.length > 0 && (
              <div className="pt-2 border-t border-ivory-border dark:border-dark-border">
                <label className="block text-xs font-bold uppercase tracking-wider text-espresso-muted dark:text-dark-muted mb-2">
                  Choose Portion / Size
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {item.variants.map((v) => (
                    <button
                      key={v.name}
                      type="button"
                      onClick={() => setSelectedVariant(v)}
                      className={`px-3 py-2.5 rounded-xl text-left border text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                        selectedVariant?.name === v.name
                          ? 'border-primary bg-primary-light/80 dark:bg-primary/20 text-primary ring-1 ring-primary'
                          : 'border-ivory-border dark:border-dark-border bg-white dark:bg-dark-surface text-espresso dark:text-dark-text hover:border-espresso-muted'
                      }`}
                    >
                      <span>{v.name}</span>
                      <span className="font-bold">₹{v.price}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Customization Options */}
            {item.customizationOptions && item.customizationOptions.length > 0 && (
              <div className="pt-2 border-t border-ivory-border dark:border-dark-border">
                {item.customizationOptions.map((group) => (
                  <div key={group.groupName} className="mb-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-espresso-muted dark:text-dark-muted mb-2">
                      {group.groupName}
                    </label>
                    <div className="space-y-1.5">
                      {group.options.map((opt) => {
                        const isChecked = selectedAddons.some((a) => a.name === opt.name);
                        return (
                          <button
                            key={opt.name}
                            type="button"
                            onClick={() => handleToggleAddon(opt)}
                            className={`w-full px-3 py-2 rounded-xl text-left border text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                              isChecked
                                ? 'border-primary bg-primary-light/80 dark:bg-primary/20 text-primary'
                                : 'border-ivory-border dark:border-dark-border bg-white dark:bg-dark-surface text-espresso dark:text-dark-text hover:bg-ivory-soft dark:hover:bg-dark-card'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span
                                className={`w-4 h-4 rounded flex items-center justify-center border text-[10px] ${
                                  isChecked
                                    ? 'bg-primary text-white border-primary'
                                    : 'border-espresso-muted dark:border-dark-muted bg-white dark:bg-dark-surface'
                                }`}
                              >
                                {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                              </span>
                              {opt.name}
                            </span>
                            <span className="font-bold text-espresso-muted dark:text-dark-muted">
                              {opt.price > 0 ? `+₹${opt.price}` : 'Free'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Allergens Notice */}
            {item.allergenInformation && item.allergenInformation.length > 0 && (
              <div className="pt-2 flex items-start gap-1.5 text-[11px] text-espresso-muted dark:text-dark-muted">
                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>Allergen information: Contains {item.allergenInformation.join(', ')}.</span>
              </div>
            )}
          </div>

          {/* Action Row: Quantity + Add To Order */}
          <div className="pt-5 mt-4 border-t border-ivory-border dark:border-dark-border flex items-center gap-3">
            {/* Quantity Selector */}
            <div className="flex items-center border border-ivory-border dark:border-dark-border rounded-xl bg-ivory-soft dark:bg-dark-surface p-1">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-espresso dark:text-dark-text hover:bg-white dark:hover:bg-dark-card transition-colors active:scale-90 cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span key={quantity} className="w-8 text-center text-sm font-bold text-espresso dark:text-dark-text animate-badge-pop">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-espresso dark:text-dark-text hover:bg-white dark:hover:bg-dark-card transition-colors active:scale-90 cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              className={`flex-1 py-3.5 px-5 rounded-2xl font-bold text-sm text-white shadow-md transition-all flex items-center justify-center gap-2 hover:shadow-hover hover:-translate-y-0.5 active:scale-95 cursor-pointer btn-shine ${
                addedAnimation
                  ? 'bg-forest scale-[0.98]'
                  : 'bg-gradient-ember'
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-5 h-5 stroke-[2.5]" />
                  <span>Added to Order!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Order • ₹{totalPrice}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;
