import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Loading State Component
 * 
 * @param {Object} props
 * @param {'spinner'|'skeleton'} props.type - Type of loading indicator
 * @param {string} props.message - Optional loading message
 * @param {number} props.count - Number of skeleton items to show
 */
export const LoadingState = ({ type = 'spinner', message = 'Loading...', count = 3 }) => {
  if (type === 'spinner') {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="mt-3 text-sm text-gray-500">{message}</p>
      </div>
    );
  }

  // Skeleton loader
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-200 rounded"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingState;
