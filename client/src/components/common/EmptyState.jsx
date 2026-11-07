import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionText,
  actionLink,
  onAction,
}) => {
  return (
    <div className="text-center py-16 px-4 bg-white rounded-2xl border border-brand-grey-border shadow-subtle max-w-lg mx-auto">
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-brand-cream flex items-center justify-center text-brand-red mx-auto mb-4">
          <Icon className="w-8 h-8 stroke-[1.8]" />
        </div>
      )}
      <h3 className="font-display font-bold text-xl text-brand-charcoal mb-2">
        {title}
      </h3>
      <p className="text-sm text-brand-grey mb-6 leading-relaxed max-w-sm mx-auto">
        {description}
      </p>
      {actionLink && actionText && (
        <Link to={actionLink}>
          <Button variant="primary">{actionText}</Button>
        </Link>
      )}
      {onAction && actionText && !actionLink && (
        <Button variant="primary" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;

