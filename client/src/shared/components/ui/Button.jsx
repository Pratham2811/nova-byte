import React from 'react';
import { getButtonClasses } from '@/theme';

/**
 * Reusable Button Component
 * 
 * @param {Object} props
 * @param {'primary'|'secondary'|'danger'|'ghost'|'text'} props.variant - Button style variant
 * @param {'sm'|'md'|'lg'} props.size - Button size
 * @param {boolean} props.fullWidth - Whether button should take full width
 * @param {boolean} props.disabled - Whether button is disabled
 * @param {React.ReactNode} props.children - Button content
 * @param {React.ReactNode} props.icon - Optional icon to display before text
 * @param {Function} props.onClick - Click handler
 * @param {string} props.className - Additional CSS classes
 */
export const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  children,
  icon,
  onClick,
  className = '',
  type = 'button',
  ...rest
}) => {
  const buttonClasses = getButtonClasses(variant, size, fullWidth);
  
  return (
    <button
      type={type}
      className={`${buttonClasses} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
