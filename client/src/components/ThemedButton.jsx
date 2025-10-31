
import React from 'react';
import { useTheme } from '@/hooks/useTheme';

export const ThemedButton = ({ 
  variant = 'primary', 
  size = 'md', 
  icon: Icon,
  children,
  onClick,
  disabled = false,
  className = '',
  ...props 
}) => {
  const { getButton } = useTheme();
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={getButton(variant, size, className)}
      {...props}
    >
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
};