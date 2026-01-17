import React from 'react';
import { getIconButtonClasses } from '@/theme';

/**
 * Reusable Icon Button Component
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.icon - Icon component to render
 * @param {Function} props.onClick - Click handler
 * @param {'small'|'base'|'large'} props.size - Button size
 * @param {string} props.tooltip - Tooltip text
 * @param {boolean} props.disabled - Whether button is disabled
 * @param {string} props.className - Additional CSS classes
 */
export const IconButton = ({
  icon,
  onClick,
  size = 'base',
  tooltip,
  disabled = false,
  className = '',
  ...rest
}) => {
  const buttonClasses = getIconButtonClasses(size);
  
  return (
    <button
      className={`${buttonClasses} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
      title={tooltip}
      aria-label={tooltip}
      {...rest}
    >
      {icon}
    </button>
  );
};

export default IconButton;
