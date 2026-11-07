import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../contexts/CartContext';
import StepProgress from '../components/pizza/StepProgress';
import IngredientCard from '../components/pizza/IngredientCard';
import CustomPizzaVisualizer from '../components/pizza/CustomPizzaVisualizer';
import Button from '../components/common/Button';
import {
  ArrowLeft,
  ArrowRight,
  ChefHat,
  ShoppingBag,
  CheckCircle,
} from 'lucide-react';

const BuilderPage = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [ingredients, setIngredients] = useState({
    bases: [],
    sauces: [],
    cheeses: [],
    vegetables: [],
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedBase, setSelectedBase] = useState(null);
  const [selectedSauce, setSelectedSauce] = useState(null);
  const [selectedCheese, setSelectedCheese] = useState(null);
  const [selectedVeggies, setSelectedVeggies] = useState([]);
  const [addedToast, setAddedToast] = useState(false);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await api.get('/pizza-builder/options');
        if (res.success && res.data) {
          setIngredients(res.data);
          // Set sensible defaults if available
          if (res.data.bases.length > 0) setSelectedBase(res.data.bases[0]);
          if (res.data.sauces.length > 0) setSelectedSauce(res.data.sauces[0]);
          if (res.data.cheeses.length > 0) setSelectedCheese(res.data.cheeses[0]);
        }
      } catch (err) {
        console.error('Error fetching builder ingredients:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOptions();
  }, []);

  // Compute live price (Starting custom base ₹199 + adjustments)
  const baseStarterPrice = 199;
  const totalPrice =
    baseStarterPrice +
    (selectedBase?.priceAdjustment || 0) +
    (selectedSauce?.priceAdjustment || 0) +
    (selectedCheese?.priceAdjustment || 0) +
    selectedVeggies.reduce((sum, v) => sum + (v.priceAdjustment || 0), 0);

  const completedSteps = {
    1: !!selectedBase,
    2: !!selectedSauce,
    3: !!selectedCheese,
    4: true, // Veggies optional
  };

  const isCurrentStepValid = () => {
    if (currentStep === 1) return !!selectedBase;
    if (currentStep === 2) return !!selectedSauce;
    if (currentStep === 3) return !!selectedCheese;
    return true;
  };

  const isReadyToOrder = !!selectedBase && !!selectedSauce && !!selectedCheese;

  const handleToggleVeggie = (veg) => {
    setSelectedVeggies((prev) => {
      const exists = prev.some((v) => v._id === veg._id);
      if (exists) {
        return prev.filter((v) => v._id !== veg._id);
      } else {
        return [...prev, veg];
      }
    });
  };

  const handleAddToCart = () => {
    if (!isReadyToOrder) return;

    addToCart({
      type: 'custom',
      name: `Custom Pizza (${selectedBase.name})`,
      unitPrice: totalPrice,
      quantity: 1,
      baseId: selectedBase._id,
      sauceId: selectedSauce._id,
      cheeseId: selectedCheese._id,
      vegetableIds: selectedVeggies.map((v) => v._id),
      customization: {
        base: selectedBase,
        sauce: selectedSauce,
        cheese: selectedCheese,
        vegetables: selectedVeggies,
      },
    });

    setAddedToast(true);
    setTimeout(() => {
      setAddedToast(false);
      navigate('/cart');
    }, 1200);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="font-semibold text-espresso dark:text-dark-text">Prepping fresh dough and ingredients...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Toast Alert */}
      {addedToast && (
        <div className="fixed top-24 right-4 z-50 bg-forest text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in">
          <CheckCircle className="w-6 h-6 shrink-0" />
          <div>
            <p className="font-bold text-sm">Custom Pizza Added!</p>
            <p className="text-xs text-white/80">Redirecting to cart...</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-ivory-border dark:border-dark-border">
        <div>
          <div className="inline-flex items-center gap-1.5 text-primary text-xs font-bold uppercase tracking-wider mb-1">
            <ChefHat className="w-3.5 h-3.5" />
            <span>Artisan Customization</span>
          </div>
          <h1 className="font-display font-normal text-3xl sm:text-4xl text-espresso dark:text-dark-text transition-colors">
            Build Your Perfect Pizza
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-espresso-muted dark:text-dark-muted font-bold font-sans">Starter Price:</span>
          <span className="font-sans font-extrabold text-2xl text-primary">
            ₹{baseStarterPrice}
          </span>
        </div>
      </div>

      {/* Step Progress Stepper */}
      <StepProgress
        currentStep={currentStep}
        onStepClick={(s) => setCurrentStep(s)}
        completedSteps={completedSteps}
      />

      {/* Main Grid: Customizer Step vs Live Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Current Step Options */}
        <div className="lg:col-span-8 bg-white dark:bg-dark-card rounded-3xl border border-ivory-border dark:border-dark-border p-6 shadow-subtle space-y-6 transition-colors">
          {/* Step 1: Base Crust */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-xl text-espresso dark:text-dark-text">
                    Step 1: Choose Your Crust Base
                  </h3>
                  <p className="text-xs text-espresso-muted dark:text-dark-muted mt-0.5">
                    Select exactly 1 from our 5 slow-fermented artisan bases.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-ivory-soft dark:bg-dark-surface text-espresso dark:text-dark-text text-xs font-bold border border-ivory-border dark:border-dark-border">
                  5 Options
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {ingredients.bases.map((base) => (
                  <IngredientCard
                    key={base._id}
                    ingredient={base}
                    selected={selectedBase?._id === base._id}
                    onSelect={(b) => setSelectedBase(b)}
                    disabled={!base.isAvailable}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Sauce */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-xl text-espresso dark:text-dark-text">
                    Step 2: Select Gourmet Sauce
                  </h3>
                  <p className="text-xs text-espresso-muted dark:text-dark-muted mt-0.5">
                    Select exactly 1 from our 5 freshly simmered artisan sauces.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-ivory-soft dark:bg-dark-surface text-espresso dark:text-dark-text text-xs font-bold border border-ivory-border dark:border-dark-border">
                  5 Options
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {ingredients.sauces.map((sauce) => (
                  <IngredientCard
                    key={sauce._id}
                    ingredient={sauce}
                    selected={selectedSauce?._id === sauce._id}
                    onSelect={(s) => setSelectedSauce(s)}
                    disabled={!sauce.isAvailable}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Cheese */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-display font-bold text-xl text-espresso dark:text-dark-text">
                  Step 3: Pick Your Signature Cheese
                </h3>
                <p className="text-xs text-espresso-muted dark:text-dark-muted mt-0.5">
                  Select 1 signature cheese melt for the ultimate stretch.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {ingredients.cheeses.map((cheese) => (
                  <IngredientCard
                    key={cheese._id}
                    ingredient={cheese}
                    selected={selectedCheese?._id === cheese._id}
                    onSelect={(c) => setSelectedCheese(c)}
                    disabled={!cheese.isAvailable}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Vegetables */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-xl text-espresso dark:text-dark-text">
                    Step 4: Load Fresh Vegetables
                  </h3>
                  <p className="text-xs text-espresso-muted dark:text-dark-muted mt-0.5">
                    Select as many farm-fresh toppings as you like!
                  </p>
                </div>
                <span className="text-xs font-bold text-primary">
                  {selectedVeggies.length} Selected
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {ingredients.vegetables.map((veg) => {
                  const isChecked = selectedVeggies.some((v) => v._id === veg._id);
                  return (
                    <IngredientCard
                      key={veg._id}
                      ingredient={veg}
                      selected={isChecked}
                      onSelect={handleToggleVeggie}
                      disabled={!veg.isAvailable}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Step Navigation Buttons */}
          <div className="pt-6 border-t border-ivory-border dark:border-dark-border flex items-center justify-between gap-4">
            {currentStep > 1 ? (
              <Button
                variant="outline"
                size="md"
                onClick={() => setCurrentStep((prev) => prev - 1)}
                icon={ArrowLeft}
              >
                Previous Step
              </Button>
            ) : (
              <div></div>
            )}

            {currentStep < 4 ? (
              <Button
                variant="primary"
                size="md"
                disabled={!isCurrentStepValid()}
                onClick={() => setCurrentStep((prev) => prev + 1)}
                icon={ArrowRight}
                iconPosition="right"
              >
                Next Step
              </Button>
            ) : (
              <Button
                variant="gradient"
                size="md"
                disabled={!isReadyToOrder}
                onClick={handleAddToCart}
                icon={ShoppingBag}
              >
                Add to Cart (₹{totalPrice})
              </Button>
            )}
          </div>
        </div>

        {/* Right Column: Live Visualizer & Price Summary */}
        <div className="lg:col-span-4">
          <CustomPizzaVisualizer
            selectedBase={selectedBase}
            selectedSauce={selectedSauce}
            selectedCheese={selectedCheese}
            selectedVeggies={selectedVeggies}
            totalPrice={totalPrice}
            onAddToCart={handleAddToCart}
            isValid={isReadyToOrder}
            validationMessage={
              !selectedBase
                ? 'Select a Crust Base to continue'
                : !selectedSauce
                ? 'Select a Sauce to continue'
                : !selectedCheese
                ? 'Select a Cheese to continue'
                : ''
            }
          />
        </div>
      </div>
    </div>
  );
};

export default BuilderPage;
