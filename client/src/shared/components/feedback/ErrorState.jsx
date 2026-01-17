import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

/**
 * Error State Component
 * 
 * @param {Object} props
 * @param {string|Error} props.error - Error message or Error object
 * @param {Function} props.onRetry - Retry handler
 * @param {string} props.title - Custom error title
 */
export const ErrorState = ({ error, onRetry, title = 'Something went wrong' }) => {
  const errorMessage = typeof error === 'string' ? error : error?.message || 'An unexpected error occurred';

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="mb-4 p-4 rounded-full bg-red-50">
        <AlertCircle size={48} className="text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-600 mb-6 text-center max-w-md">{errorMessage}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry} icon={<RefreshCw size={16} />}>
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
