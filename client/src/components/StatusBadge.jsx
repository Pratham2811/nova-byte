import React from 'react';
import { useTheme } from '@/hooks/useTheme';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

export const StatusBadge = ({ 
  status = 'info', // 'success', 'error', 'warning', 'info'
  children,
  showIcon = true,
  className = '',
  ...props 
}) => {
  const { theme } = useTheme();
  
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
  };
  
  const Icon = icons[status];
  
  return (
    <span
      className={`${theme.components.badge[status]} inline-flex items-center gap-2 ${className}`}
      {...props}
    >
      {showIcon && Icon && <Icon size={14} />}
      {children}
    </span>
  );
};