import React from 'react';

export const PizzaCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-brand-grey-border overflow-hidden shadow-subtle animate-pulse">
      <div className="h-48 bg-gray-200 w-full"></div>
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-6 bg-gray-300 rounded w-3/4"></div>
        <div className="space-y-1.5">
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-4/5"></div>
        </div>
        <div className="pt-4 flex items-center justify-between border-t border-gray-100">
          <div className="h-6 bg-gray-300 rounded w-1/3"></div>
          <div className="h-9 bg-gray-200 rounded-lg w-1/3"></div>
        </div>
      </div>
    </div>
  );
};

export const TableRowSkeleton = ({ cols = 5 }) => {
  return (
    <tr className="animate-pulse border-b border-gray-100">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="py-4 px-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </td>
      ))}
    </tr>
  );
};

