import React from 'react';

const LoadingSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse bg-white rounded-2xl p-2 shadow-sm border border-stone-100 h-64 flex flex-col">
          <div className="bg-stone-200 w-full h-40 rounded-xl mb-4"></div>
          <div className="px-2">
            <div className="h-4 bg-stone-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-stone-200 rounded w-1/2"></div>
          </div>
          <div className="mt-auto px-2 pb-2 flex space-x-2">
             <div className="h-8 bg-stone-200 rounded flex-1"></div>
             <div className="h-8 bg-stone-200 rounded flex-1"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
