import React, { useState, useEffect } from 'react';
import { useCart } from '../../contexts/CartContext';
import { Plus, Check, Star, Utensils } from 'lucide-react';
import api from '../../services/api';

const CompleteYourMeal = () => {
  const { cart, addToCart } = useCart();
  const [recommendations, setRecommendations] = useState([]);
  const [addedIds, setAddedIds] = useState(new Set());

  useEffect(() => {
    const fetchSidesAndDrinks = async () => {
      try {
        const res = await api.get('/pizzas');
        const allItems = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        // Filter for sides, drinks, desserts not already in cart
        const cartIds = new Set(cart.map((c) => c.pizzaId));
        const picks = allItems
          .filter(
            (item) =>
              (item.category === 'Sides' || item.category === 'Drinks' || item.category === 'Desserts') &&
              !cartIds.has(item._id)
          )
          .slice(0, 4);

        setRecommendations(picks);
      } catch (err) {
        console.error('Failed to load meal pairings:', err);
      }
    };

    fetchSidesAndDrinks();
  }, [cart]);

  if (recommendations.length === 0) return null;

  const handleQuickAdd = (item) => {
    addToCart({
      type: 'standard',
      pizzaId: item._id,
      name: item.name,
      image: item.image,
      category: item.category,
      basePrice: item.basePrice,
      unitPrice: item.basePrice,
      quantity: 1,
    });

    setAddedIds((prev) => new Set([...prev, item._id]));
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(item._id);
        return next;
      });
    }, 1500);
  };

  return (
    <div className="mt-8 pt-6 border-t border-ivory-border dark:border-dark-border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-display font-bold text-espresso dark:text-dark-text">Complete Your Meal</h3>
          <p className="text-xs text-espresso-muted dark:text-dark-muted">Popular sides, chilled craft coolers & artisan sweets</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-honey-light dark:bg-honey/20 text-forest dark:text-honey border border-honey/30">
          Pair & Save
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {recommendations.map((item) => {
          const isJustAdded = addedIds.has(item._id);
          return (
            <div
              key={item._id}
              className="bg-white dark:bg-dark-card rounded-2xl p-3 border border-ivory-border dark:border-dark-border shadow-subtle hover:shadow-card transition-all flex items-center gap-3 group"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 rounded-xl object-cover shrink-0 bg-ivory-soft dark:bg-dark-surface group-hover:scale-105 transition-transform"
                loading="lazy"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  {item.category}
                </span>
                <h4 className="text-xs font-bold text-espresso dark:text-dark-text truncate">{item.name}</h4>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-xs font-extrabold text-espresso dark:text-dark-text">₹{item.basePrice}</span>
                  <button
                    type="button"
                    onClick={() => handleQuickAdd(item)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer active:scale-95 ${
                      isJustAdded
                        ? 'bg-forest text-white'
                        : 'bg-primary-light/80 dark:bg-primary/20 text-primary hover:bg-primary hover:text-white'
                    }`}
                  >
                    {isJustAdded ? (
                      <>
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3 h-3" />
                        <span>Add</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CompleteYourMeal;
