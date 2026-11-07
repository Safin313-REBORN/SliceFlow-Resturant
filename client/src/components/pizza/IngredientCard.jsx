import React from 'react';
import { Check } from 'lucide-react';

const IngredientCard = ({
  ingredient,
  selected = false,
  onSelect,
  disabled = false,
}) => {
  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-pressed={selected}
      aria-disabled={disabled}
      onClick={() => !disabled && onSelect(ingredient)}
      onKeyDown={(e) => {
        if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onSelect(ingredient);
        }
      }}
      className={`relative rounded-3xl border p-4 sm:p-5 cursor-pointer transition-all duration-200 flex flex-col justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-98 ${
        disabled
          ? 'opacity-40 bg-gray-100 dark:bg-dark-surface/50 cursor-not-allowed border-gray-200 dark:border-dark-border'
          : selected
          ? 'bg-white dark:bg-dark-card border-primary ring-2 ring-primary shadow-glow scale-[1.01]'
          : 'bg-white dark:bg-dark-card border-ivory-border dark:border-dark-border hover:border-primary/50 dark:hover:border-primary/50 hover:shadow-subtle'
      }`}
    >
      {/* Top badges */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <span
          className={`text-xs font-bold px-2.5 py-1 rounded-full ${
            ingredient.priceAdjustment > 0
              ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300'
              : 'bg-forest-light dark:bg-forest/20 text-forest dark:text-emerald-400'
          }`}
        >
          {ingredient.priceAdjustment > 0
            ? `+₹${ingredient.priceAdjustment}`
            : 'Included'}
        </span>

        {selected && (
          <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shrink-0 shadow-sm animate-fade-in">
            <Check className="w-4 h-4 stroke-[3]" />
          </span>
        )}
      </div>

      {/* Image & details */}
      <div className="flex items-center gap-4">
        {ingredient.image && (
          <img
            src={ingredient.image}
            alt={ingredient.name}
            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-2xl shrink-0 bg-ivory-soft dark:bg-dark-surface border border-ivory-border dark:border-dark-border"
            loading="lazy"
          />
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-sans font-bold text-sm sm:text-base text-espresso dark:text-dark-text truncate">
            {ingredient.name}
          </h4>
          <p className="text-xs text-espresso-muted dark:text-dark-muted mt-1 line-clamp-2 leading-relaxed font-sans">
            {ingredient.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default IngredientCard;
