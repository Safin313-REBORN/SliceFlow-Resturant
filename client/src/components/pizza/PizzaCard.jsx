import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useCart } from '../../contexts/CartContext';
import ProductDetailsModal from '../food/ProductDetailsModal';
import { Plus, Check, Star, Flame, Clock, Heart, Eye } from 'lucide-react';

const FALLBACK_FOOD_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23F1E9DE'/%3E%3Ctext x='50%25' y='46%25' font-size='44' text-anchor='middle' dominant-baseline='middle'%3E🍕%3C/text%3E%3Ctext x='50%25' y='68%25' font-family='sans-serif' font-size='13' font-weight='700' fill='%2383766D' text-anchor='middle'%3ESliceFlow Artisan Kitchen%3C/text%3E%3C/svg%3E";

const PizzaCard = ({ pizza }) => {
  const { addToCart, isWishlisted, toggleWishlist } = useCart();
  const [added, setAdded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const wishlisted = isWishlisted(pizza._id);

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    addToCart({
      type: 'standard',
      pizzaId: pizza._id,
      name: pizza.name,
      basePrice: pizza.basePrice,
      unitPrice: pizza.basePrice,
      quantity: 1,
      image: pizza.image,
      category: pizza.category,
    });
    setAdded(true);
    confetti({ particleCount: 22, spread: 45, origin: { y: 0.8 } });
    setTimeout(() => setAdded(false), 1400);
  };

  const handleToggleFav = (e) => {
    e.stopPropagation();
    toggleWishlist(pizza);
  };

  const categoryPills = {
    Pizza: 'bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary-light',
    Burgers: 'bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
    Pasta: 'bg-emerald-100 text-emerald-900 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
    Sides: 'bg-orange-100 text-orange-900 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800',
    Desserts: 'bg-pink-100 text-pink-900 border-pink-200 dark:bg-pink-950/40 dark:text-pink-300 dark:border-pink-800',
    Drinks: 'bg-cyan-100 text-cyan-900 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-800',
    Combos: 'bg-forest text-white border-forest dark:bg-[#1C2E25]',
  };

  return (
    <>
      <div
        data-testid="food-card"
        onClick={() => setModalOpen(true)}
        className="bg-white dark:bg-dark-card rounded-3xl border border-ivory-border dark:border-dark-border overflow-hidden shadow-subtle hover-lift flex flex-col group cursor-pointer transition-all duration-300 hover:border-primary/50 dark:hover:border-primary/50 relative"
      >
        {/* Food Image Container */}
        <div className="relative h-64 sm:h-60 lg:h-64 overflow-hidden bg-ivory-soft dark:bg-dark-surface">
          <img
            src={pizza.image}
            alt={pizza.name}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = FALLBACK_FOOD_IMG;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-espresso/40 via-transparent to-transparent opacity-60" />

          {/* Top Badges */}
          <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 flex-wrap">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm ${
                categoryPills[pizza.category] || 'bg-ivory-soft text-espresso border-ivory-border dark:bg-dark-surface dark:text-[#FAF6EF]'
              }`}
            >
              {pizza.category}
            </span>
            {pizza.spiceLevel > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-status-error text-white flex items-center gap-1 shadow-sm">
                <Flame className="w-3 h-3 fill-current" />
                {pizza.spiceLevel === 1 ? 'Mild' : pizza.spiceLevel === 2 ? 'Medium' : 'Hot'}
              </span>
            )}
            {pizza.isBestseller && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-honey text-forest shadow-sm animate-pulse">
                Bestseller
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={handleToggleFav}
            className={`absolute top-3.5 right-3.5 w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-sm cursor-pointer ${
              wishlisted
                ? 'bg-primary text-white scale-110 animate-heart-beat'
                : 'bg-white/90 dark:bg-dark-surface/90 text-espresso dark:text-[#FAF6EF] hover:text-primary hover:bg-white active:scale-90'
            }`}
            aria-label="Add to favorites"
          >
            <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} />
          </button>

          {/* Bottom Overlay Info (Rating & Prep Time) */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-medium">
            <div className="bg-espresso/80 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-honey fill-honey" />
              <span className="font-bold">{pizza.rating || 4.8}</span>
              <span className="text-white/70 text-[10px]">({pizza.ratingCount || 120})</span>
            </div>

            <div className="bg-espresso/80 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 text-[11px]">
              <Clock className="w-3.5 h-3.5 text-white/80" />
              <span>{pizza.preparationTime || '15 mins'}</span>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-sans font-bold text-xl text-espresso dark:text-[#FAF6EF] group-hover:text-primary transition-colors leading-snug">
                {pizza.name}
              </h3>
            </div>

            <p className="text-sm text-espresso-muted dark:text-[#A3B8AC] mt-2 line-clamp-2 leading-relaxed font-sans">
              {pizza.description}
            </p>

            {/* Tags / Portions */}
            <div className="flex items-center gap-2 mt-3 text-xs text-espresso-muted dark:text-[#A3B8AC] flex-wrap">
              {pizza.portionInformation && (
                <span className="px-2.5 py-1 rounded-md bg-ivory-soft dark:bg-dark-surface border border-ivory-border dark:border-dark-border font-semibold text-espresso dark:text-[#FAF6EF]">
                  {pizza.portionInformation}
                </span>
              )}
              {pizza.dietaryTags?.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-md bg-forest-light dark:bg-forest/20 text-forest dark:text-emerald-400 font-semibold"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Pricing & Actions */}
          <div className="pt-4 border-t border-ivory-border dark:border-dark-border flex items-center justify-between gap-2">
            <div>
              <span className="text-[11px] uppercase font-bold tracking-wider text-espresso-muted dark:text-[#A3B8AC] block">
                Price
              </span>
              <span className="font-sans font-extrabold text-2xl sm:text-3xl text-espresso dark:text-[#FAF6EF] tracking-tight">
                ₹{pizza.basePrice}
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setModalOpen(true);
                }}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2.5 rounded-2xl border border-ivory-border dark:border-dark-border bg-ivory-soft dark:bg-dark-surface hover:bg-white dark:hover:bg-dark-card text-espresso dark:text-[#FAF6EF] hover:text-primary dark:hover:text-primary transition-colors cursor-pointer active:scale-95"
                title="View detailed portions & ingredients"
                aria-label="View details"
              >
                <Eye className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleQuickAdd}
                className={`min-h-[44px] py-2.5 px-5 rounded-2xl text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer btn-shine ${
                  added
                    ? 'bg-status-success text-white animate-badge-pop shadow-md scale-105'
                    : 'bg-primary hover:bg-primary-hover text-white hover:shadow-hover hover:-translate-y-0.5'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Added</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>Quick Add</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Modal */}
      <ProductDetailsModal
        item={pizza}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
};

export default PizzaCard;
