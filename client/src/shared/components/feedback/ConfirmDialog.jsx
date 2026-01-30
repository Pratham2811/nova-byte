import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

/**
 * Confirmation Dialog Component
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether dialog is open
 * @param {Function} props.onClose - Close handler
 * @param {Function} props.onConfirm - Confirm handler
 * @param {string} props.title - Dialog title
 * @param {string} props.message - Confirmation message
 * @param {string} props.confirmText - Confirm button text (default: "Confirm")
 * @param {string} props.cancelText - Cancel button text (default: "Cancel")
 * @param {'danger'|'warning'|'info'} props.variant - Dialog variant (default: "warning")
 * @param {boolean} props.loading - Whether confirm action is loading
 */
export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'warning',
  loading = false,
}) => {

  const handleConfirm = async () => {
    await onConfirm();
  };

  const variantConfig = {
    danger: {
      icon: <AlertTriangle size={48} className="text-red-500" />,
      bgColor: 'bg-red-50',
      buttonVariant: 'danger',
    },
    warning: {
      icon: <AlertTriangle size={48} className="text-orange-500" />,
      bgColor: 'bg-orange-50',
      buttonVariant: 'danger',
    },
    info: {
      icon: <AlertTriangle size={48} className="text-blue-500" />,
      bgColor: 'bg-blue-50',
      buttonVariant: 'primary',
    },
  };

  const config = variantConfig[variant] || variantConfig.warning;

  const footer = (
    <>
      <Button variant="ghost" onClick={onClose} disabled={loading}>
        {cancelText}
      </Button>
      <Button variant={config.buttonVariant} onClick={handleConfirm} disabled={loading}>
        {loading ? 'Processing...' : confirmText}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={footer}
      closeOnBackdrop={!loading}
      size="sm"
    >
      <div className="flex flex-col items-center text-center py-4">
        <div className={`mb-4 p-3 rounded-full ${config.bgColor}`}>
          {config.icon}
        </div>
        <p className="text-gray-700">{message}</p>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
