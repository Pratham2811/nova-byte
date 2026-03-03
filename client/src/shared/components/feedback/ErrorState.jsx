import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";

/**
 * Error State Component
 * Renders a premium placeholder when an error occurs.
 * * @param {Object} props
 * @param {string|Error} props.error - Error message or Error object
 * @param {Function} props.onRetry - Retry handler
 * @param {string} props.title - Custom error title
 */
export const ErrorState = ({ error, onRetry, title = 'Something went wrong' }) => {
  const errorMessage = typeof error === 'string' ? error : error?.message || 'An unexpected error occurred';

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-in fade-in zoom-in-95 duration-500">
      
      {/* Icon Container with subtle red glow */}
      <div className="relative mb-6 group">
        <div className="absolute inset-0 bg-red-100 rounded-full blur-xl opacity-40 transition-opacity" />
        <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-white border border-red-50 shadow-sm">
          <AlertCircle className="w-10 h-10 text-red-500" strokeWidth={1.5} />
        </div>
      </div>

      {/* Text Content */}
      <div className="max-w-md space-y-2 mb-8">
        <h3 className="text-lg font-semibold text-slate-900 tracking-tight">
          {title}
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed">
          {errorMessage}
        </p>
      </div>

      {/* Retry Action */}
      {onRetry && (
        <Button 
          variant="outline" 
          onClick={onRetry} 
          className="h-10 px-6 rounded-lg border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-sm transition-all active:scale-95"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      )}
      
    </div>
  );
};

export default ErrorState;