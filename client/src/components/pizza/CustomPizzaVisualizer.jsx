import React from 'react';
import Button from '../common/Button';
import { ShoppingBag, ChefHat, CheckCircle2 } from 'lucide-react';

const CustomPizzaVisualizer = ({
  selectedBase,
  selectedSauce,
  selectedCheese,
  selectedVeggies,
  totalPrice,
  onAddToCart,
  isValid,
  validationMessage,
}) => {
  return (
    <div className="bg-white dark:bg-dark-card rounded-3xl border border-ivory-border dark:border-dark-border p-5 sm:p-6 shadow-card sticky top-24 transition-colors">
      <div className="flex items-center justify-between pb-4 border-b border-ivory-border dark:border-dark-border">
        <div>
          <h3 className="font-display font-bold text-lg text-espresso dark:text-dark-text flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-primary" />
            Your Custom Creation
          </h3>
          <p className="text-xs text-espresso-muted dark:text-dark-muted mt-0.5">Live ingredient stack & pricing</p>
        </div>
        <div className="text-right">
          <span className="text-xs text-espresso-muted dark:text-dark-muted block">Price</span>
          <span className="font-sans font-extrabold text-2xl text-primary">
            ₹{totalPrice}
          </span>
        </div>
      </div>

      {/* Interactive Animated Pizza Canvas */}
      <div className="my-4 py-3 bg-ivory-soft dark:bg-dark-surface rounded-2xl flex items-center justify-center relative overflow-hidden border border-ivory-border dark:border-dark-border h-40 transition-colors">
        <div className="relative w-32 h-32 rounded-full border-4 border-amber-800/20 flex items-center justify-center transition-all duration-500 shadow-inner">
          {/* Crust Layer */}
          <div
            className={`w-full h-full rounded-full transition-all duration-500 flex items-center justify-center ${
              selectedBase
                ? 'bg-amber-700/80 shadow-md animate-scale-in'
                : 'bg-amber-100/60 dark:bg-amber-950/30 border-2 border-dashed border-amber-300 dark:border-amber-700'
            }`}
          >
            {/* Sauce Layer */}
            <div
              className={`w-28 h-28 rounded-full transition-all duration-500 flex items-center justify-center ${
                selectedSauce
                  ? selectedSauce.name.includes('Alfredo')
                    ? 'bg-amber-100 shadow-inner animate-scale-in'
                    : selectedSauce.name.includes('Pesto')
                    ? 'bg-emerald-600 shadow-inner animate-scale-in'
                    : selectedSauce.name.includes('BBQ')
                    ? 'bg-amber-950 shadow-inner animate-scale-in'
                    : 'bg-red-600 shadow-inner animate-scale-in'
                  : 'bg-transparent'
              }`}
            >
              {/* Cheese Layer */}
              <div
                className={`w-24 h-24 rounded-full transition-all duration-500 flex items-center justify-center relative ${
                  selectedCheese ? 'bg-amber-50/90 dark:bg-amber-100/90 shadow-sm animate-scale-in' : 'bg-transparent'
                }`}
              >
                {/* Vegetable Dots */}
                {selectedVeggies.map((veg, vIdx) => {
                  const angle = (vIdx / Math.max(1, selectedVeggies.length)) * 2 * Math.PI;
                  const x = Math.cos(angle) * 32;
                  const y = Math.sin(angle) * 32;
                  return (
                    <span
                      key={veg._id}
                      style={{ transform: `translate(${x}px, ${y}px)` }}
                      className="absolute w-3 h-3 rounded-full bg-emerald-600 border border-white shadow-sm animate-scale-in"
                      title={veg.name}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Layer stack summary */}
      <div className="py-4 space-y-3 text-xs sm:text-sm">
        {/* Base */}
        <div className="flex items-center justify-between py-1.5 border-b border-dashed border-ivory-border dark:border-dark-border">
          <span className="text-espresso-muted dark:text-dark-muted font-medium">1. Crust Base</span>
          <span className="font-semibold text-espresso dark:text-dark-text text-right truncate max-w-[180px]">
            {selectedBase ? selectedBase.name : <span className="text-espresso-muted dark:text-dark-muted italic">Required</span>}
          </span>
        </div>

        {/* Sauce */}
        <div className="flex items-center justify-between py-1.5 border-b border-dashed border-ivory-border dark:border-dark-border">
          <span className="text-espresso-muted dark:text-dark-muted font-medium">2. Sauce</span>
          <span className="font-semibold text-espresso dark:text-dark-text text-right truncate max-w-[180px]">
            {selectedSauce ? selectedSauce.name : <span className="text-espresso-muted dark:text-dark-muted italic">Required</span>}
          </span>
        </div>

        {/* Cheese */}
        <div className="flex items-center justify-between py-1.5 border-b border-dashed border-ivory-border dark:border-dark-border">
          <span className="text-espresso-muted dark:text-dark-muted font-medium">3. Cheese</span>
          <span className="font-semibold text-espresso dark:text-dark-text text-right truncate max-w-[180px]">
            {selectedCheese ? selectedCheese.name : <span className="text-espresso-muted dark:text-dark-muted italic">Required</span>}
          </span>
        </div>

        {/* Veggies */}
        <div className="flex items-start justify-between py-1.5">
          <span className="text-espresso-muted dark:text-dark-muted font-medium">4. Toppings</span>
          <div className="text-right max-w-[180px]">
            {selectedVeggies.length === 0 ? (
              <span className="text-espresso-muted dark:text-dark-muted italic">None (Optional)</span>
            ) : (
              <p className="font-semibold text-espresso dark:text-dark-text leading-tight">
                {selectedVeggies.map((v) => v.name).join(', ')}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Validation or Action */}
      <div className="pt-4 border-t border-ivory-border dark:border-dark-border">
        {isValid ? (
          <Button
            variant="gradient"
            size="lg"
            className="w-full shadow-glow"
            onClick={onAddToCart}
            icon={ShoppingBag}
          >
            Add Custom Pizza • ₹{totalPrice}
          </Button>
        ) : (
          <div className="p-3 rounded-2xl bg-ivory-soft dark:bg-dark-surface border border-ivory-border dark:border-dark-border text-center text-xs font-semibold text-primary animate-fade-in">
            {validationMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomPizzaVisualizer;
