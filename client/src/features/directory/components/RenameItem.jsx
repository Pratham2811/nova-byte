import React, { useState } from 'react';
import { Edit } from 'lucide-react';
import { Modal, Button, Input } from '@/shared/components';

/**
 * Rename Item Component (works for both files and folders)
 * Modal to rename a file or folder
 * 
 * @param {Object} props
 * @param {Function} props.onClose - Close modal handler
 * @param {Function} props.onRename - Rename handler
 * @param {Object} props.item - Item object (file or folder) to rename
 * @param {string} props.itemType - 'file' or 'folder'
 * @param {boolean} props.loading - Rename loading state
 */
export const RenameItem = ({
  onClose,
  onRename,
  item,
  itemType = 'file',
  loading = false,
}) => {
  const [newName, setNewName] = useState(item?.name || '');
  const [error, setError] = useState('');

  const handleRename = async () => {
    // Validation
    if (!newName.trim()) {
      setError('Name is required');
      return;
    }

    if (newName.trim() === item.name) {
      setError('Please enter a different name');
      return;
    }

    if (newName.length > 255) {
      setError('Name is too long');
      return;
    }

    // Check for invalid characters
    const invalidChars = /[<>:"/\\|?*]/;
    if (invalidChars.test(newName)) {
      setError('Name contains invalid characters');
      return;
    }

await onRename(item.id, newName.trim());
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleRename();
    }
  };

  const footer = (
    <>
      <Button variant="ghost" onClick={onClose} disabled={loading}>
        Cancel
      </Button>
      <Button
        variant="primary"
        onClick={handleRename}
        disabled={!newName.trim() || newName.trim() === item.name || loading}
        icon={<Edit size={16} />}
      >
        {loading ? 'Renaming...' : 'Rename'}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={`Rename ${itemType === 'folder' ? 'Folder' : 'File'}`}
      footer={footer}
      size="sm"
      closeOnBackdrop={!loading}
    >
      <div className="space-y-4">
        <Input
          label={`${itemType === 'folder' ? 'Folder' : 'File'} Name`}
          value={newName}
          onChange={(e) => {
            setNewName(e.target.value);
            setError('');
          }}
          onKeyPress={handleKeyPress}
          error={error}
          placeholder={`Enter new ${itemType} name`}
          required
          disabled={loading}
          autoFocus
        />

        <p className="text-xs text-gray-500">
          Current name: <span className="font-medium">{item.name}</span>
        </p>
      </div>
    </Modal>
  );
};

export default RenameItem;
