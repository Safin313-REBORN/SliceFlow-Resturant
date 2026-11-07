import React from 'react';
import { Check, CircleDot } from 'lucide-react';

const steps = [
  { id: 1, title: 'Pizza Base', subtitle: '5 Artisan Crusts' },
  { id: 2, title: 'Sauce', subtitle: '5 Gourmet Sauces' },
  { id: 3, title: 'Cheese', subtitle: 'Signature Melts' },
  { id: 4, title: 'Vegetables', subtitle: 'Farm Fresh Toppings' },
];

const StepProgress = ({ currentStep, onStepClick, completedSteps }) => {
  return (
    <div className="w-full py-4">
      {/* Desktop & Tablet View */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
        {steps.map((step) => {
          const isCompleted = completedSteps[step.id];
          const isCurrent = currentStep === step.id;
          const isClickable = isCompleted || isCurrent;

          return (
            <button
              key={step.id}
              type="button"
              disabled={!isClickable}
              onClick={() => isClickable && onStepClick(step.id)}
              className={`text-left p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col justify-between cursor-pointer ${
                isCurrent
                  ? 'border-primary bg-white dark:bg-dark-card shadow-glow ring-2 ring-primary/20'
                  : isCompleted
                  ? 'border-forest/30 bg-forest-light/60 dark:bg-forest/20 hover:bg-forest-light'
                  : 'border-ivory-border dark:border-dark-border bg-ivory-soft/50 dark:bg-dark-surface/50 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center transition-colors ${
                    isCurrent
                      ? 'bg-primary text-white shadow-sm'
                      : isCompleted
                      ? 'bg-forest text-white'
                      : 'bg-ivory-border dark:bg-dark-border text-espresso-muted'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : step.id}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-espresso-muted dark:text-dark-muted">
                  Step {step.id}
                </span>
              </div>
              <div>
                <p
                  className={`text-xs sm:text-sm font-bold truncate ${
                    isCurrent
                      ? 'text-primary'
                      : isCompleted
                      ? 'text-espresso dark:text-dark-text'
                      : 'text-espresso-muted dark:text-dark-muted'
                  }`}
                >
                  {step.title}
                </p>
                <p className="text-[11px] text-espresso-muted dark:text-dark-muted truncate hidden sm:block">
                  {step.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StepProgress;
