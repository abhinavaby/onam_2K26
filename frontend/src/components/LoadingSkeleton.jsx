import React from 'react';

const LoadingSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i} 
          className="bg-[#12141e] rounded-2xl sm:rounded-3xl p-3 shadow-md border border-white/10 overflow-hidden flex flex-col"
        >
          {/* Image skeleton */}
          <div className="bg-stone-800/90 aspect-square sm:aspect-[4/3] rounded-xl sm:rounded-2xl mb-3 animate-pulse"></div>
          
          {/* Text skeletons */}
          <div className="space-y-2 px-1">
            <div className="h-4 bg-stone-700/60 rounded-md w-3/4 animate-pulse"></div>
            <div className="h-3 bg-stone-800/80 rounded-md w-1/3 animate-pulse"></div>
          </div>
          
          {/* Button skeleton */}
          <div className="mt-4 pt-2 border-t border-white/5 flex space-x-2">
            <div className="h-8 bg-amber-500/10 rounded-xl flex-1 animate-pulse border border-amber-500/20"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;


