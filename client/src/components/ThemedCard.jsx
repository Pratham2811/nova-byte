import React from 'react';
import { useTheme } from '@/hooks/useTheme';

export const ThemedCard = ({ 
  variant = 'base',
  children,
  className = '',
  onClick,
  ...props 
}) => {
  const { getCard } = useTheme();
  
  return (
    <div
      onClick={onClick}
      className={getCard(variant, className)}
      {...props}
    >
      {children}
    </div>
  );
};