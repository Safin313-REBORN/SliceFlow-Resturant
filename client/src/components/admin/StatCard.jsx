import React from 'react';

const StatCard = ({ title, value, subtext, icon: Icon, color = 'red' }) => {
  const colors = {
    red: 'bg-brand-red-light text-brand-red border-brand-red/20',
    yellow: 'bg-amber-50 text-amber-700 border-amber-200',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
  };

  return (
    <div className="bg-white rounded-2xl border border-ivory-border p-5 sm:p-6 shadow-subtle hover-lift group transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-espresso-muted">{title}</p>
          <h3 className="font-sans font-extrabold text-2xl sm:text-3xl text-espresso tracking-tight mt-1">
            {value}
          </h3>
          {subtext && <p className="text-xs text-espresso-muted mt-1 font-sans">{subtext}</p>}
        </div>
        {Icon && (
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border group-hover:scale-110 transition-transform duration-300 ${colors[color] || colors.red}`}>
            <Icon className="w-6 h-6 stroke-[2]" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;

