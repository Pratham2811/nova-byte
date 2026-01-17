import React from 'react';
import { getCardClasses } from '@/theme';

/**
 * Reusable Card Component
 * 
 * @param {Object} props
 * @param {'base'|'hover'} props.variant - Card style variant
 * @param {boolean} props.interactive - Whether card is clickable/interactive
 * @param {Function} props.onClick - Click handler (makes card interactive)
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.className - Additional CSS classes
 */
export const Card = ({
  variant = 'base',
  interactive = false,
  onClick,
  children,
  className = '',
  ...rest
}) => {
  const cardClasses = getCardClasses(variant, interactive || !!onClick);
  
  const handleClick = (e) => {
    if (onClick && !rest.disabled) {
      onClick(e);
    }
  };
  
  const Component = onClick ? 'button' : 'div';
  
  return (
    <Component
      className={`${cardClasses} ${className}`}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </Component>
  );
};

export default Card;
