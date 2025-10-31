import React from 'react';
import { useTheme } from '@/hooks/useTheme';

export const GradientHeading = ({ 
  gradient = 'primary',
  as: Component = 'h2',
  children,
  className = '',
  ...props 
}) => {
  const { getGradient } = useTheme();
  
  return (
    <Component
      className={`font-extrabold tracking-wider ${getGradient(gradient)} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};