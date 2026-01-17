import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';

/**
 * Toast Notification Component
 * 
 * @param {Object} props
 * @param {string} props.message - Toast message
 * @param {'success'|'error'|'warning'|'info'} props.type - Toast type
 * @param {number} props.duration - Duration in milliseconds (0 for persistent)
 * @param {Function} props.onClose - Close handler
 * @param {boolean} props.isOpen - Whether toast is visible
 */
export const Toast = ({
  message,
  type = 'info',
  duration = 3000,
  onClose,
  isOpen = true,
}) => {
  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  const config = {
    success: {
      icon: <CheckCircle size={20} />,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      iconColor: 'text-green-600',
    },
    error: {
      icon: <AlertCircle size={20} />,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      iconColor: 'text-red-600',
    },
    warning: {
      icon: <AlertCircle size={20} />,
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-800',
      iconColor: 'text-orange-600',
    },
    info: {
      icon: <Info size={20} />,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-600',
    },
  };

  const { icon, bgColor, borderColor, textColor, iconColor } = config[type];

  return (
    <div
      className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-[1070] ${bgColor} ${borderColor} border rounded-lg shadow-lg p-4 flex items-center gap-3 max-w-md animate-fade-in-down`}
      role="alert"
    >
      <span className={iconColor}>{icon}</span>
      <p className={`${textColor} text-sm font-medium flex-1`}>{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className={`${iconColor} hover:opacity-70 transition-opacity`}
          aria-label="Close notification"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};

export default Toast;
