import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { theme } from '@/theme';

/**
 * Reusable Modal Component
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Close handler
 * @param {string} props.title - Modal title
 * @param {React.ReactNode} props.children - Modal content
 * @param {React.ReactNode} props.footer - Optional footer content
 * @param {boolean} props.closeOnBackdrop - Whether clicking backdrop closes modal (default: true)
 * @param {string} props.size - Modal size: 'sm', 'md', 'lg', 'xl'
 */
export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  closeOnBackdrop = true,
  size = 'md',
}) => {
  const modalRef = useRef(null);

  // Focus trap
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose();
    }
  };

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div
      className={`${theme.components.modal.backdrop} flex items-center justify-center p-4`}
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className={`${theme.components.modal.container} ${sizeClasses[size]} animate-fade-in`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className={theme.components.modal.header}>
          <h2 id="modal-title" className="text-lg font-semibold text-gray-900">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className={theme.components.modal.body}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className={theme.components.modal.footer}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
