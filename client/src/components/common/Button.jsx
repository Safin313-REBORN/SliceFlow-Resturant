import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  icon: Icon,
  iconPosition = 'left',
  shine = false,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-bold tracking-wide rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-60 disabled:cursor-not-allowed select-none active:scale-95 cursor-pointer';

  const variants = {
    primary:
      'bg-primary hover:bg-primary-hover text-white shadow-sm hover:shadow-hover hover:-translate-y-0.5',
    gradient:
      'bg-gradient-ember text-white shadow-glow hover:shadow-card hover:-translate-y-0.5 font-extrabold btn-shine',
    forest:
      'bg-forest hover:bg-forest-hover text-white shadow-sm hover:shadow-card hover:-translate-y-0.5',
    honey:
      'bg-honey hover:bg-honey-hover text-forest shadow-sm hover:shadow-glow hover:-translate-y-0.5 font-bold',
    secondary:
      'bg-espresso text-white hover:bg-espresso/90 dark:bg-dark-surface dark:text-dark-text dark:hover:bg-dark-card border border-ivory-border dark:border-dark-border shadow-sm',
    outline:
      'border-2 border-primary text-primary hover:bg-primary-light dark:hover:bg-primary/10 active:bg-primary/20',
    outlineForest:
      'border-2 border-forest text-forest dark:border-honey dark:text-honey hover:bg-forest hover:text-white transition-colors',
    ghost:
      'text-espresso hover:text-primary hover:bg-ivory-soft dark:text-dark-text dark:hover:bg-dark-surface dark:hover:text-primary',
    danger:
      'bg-status-error text-white hover:brightness-95 shadow-sm active:scale-95',
  };

  const sizes = {
    xs: 'text-[11px] px-2.5 py-1 min-h-[32px] gap-1 rounded-xl',
    sm: 'text-xs px-3.5 py-1.5 min-h-[36px] gap-1.5 rounded-xl',
    md: 'text-xs sm:text-sm px-4 py-2.5 min-h-[44px] gap-2 rounded-2xl',
    lg: 'text-sm sm:text-base px-6 py-3.5 min-h-[48px] gap-2.5 rounded-2xl',
    xl: 'text-base sm:text-lg px-8 py-4 min-h-[52px] gap-3 rounded-2xl',
  };

  const shineClass = shine || variant === 'gradient' ? 'btn-shine' : '';

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${shineClass} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>Processing...</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
        </>
      )}
    </button>
  );
};

export default Button;
