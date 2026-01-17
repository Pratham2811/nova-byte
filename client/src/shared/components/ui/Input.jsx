import React from 'react';
import { getInputClasses } from '@/theme';

/**
 * Reusable Input Component
 * 
 * @param {Object} props
 * @param {string} props.label - Input label
 * @param {string} props.value - Input value
 * @param {Function} props.onChange - Change handler
 * @param {string} props.error - Error message
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.type - Input type (text, email, password, etc.)
 * @param {boolean} props.required - Whether input is required
 * @param {boolean} props.disabled - Whether input is disabled
 * @param {string} props.helperText - Helper text below input
 */
export const Input = ({
  label,
  value,
  onChange,
  error,
  placeholder,
  type = 'text',
  required = false,
  disabled = false,
  helperText,
  className = '',
  ...rest
}) => {
  const inputClasses = getInputClasses(!!error, disabled);
  
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={inputClasses}
        {...rest}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default Input;
