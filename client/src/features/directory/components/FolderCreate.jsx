import React, { useState } from 'react';
import { FolderPlus } from 'lucide-react';
import { Modal, Button, Input } from '@/shared/components';

/**
 * Create Folder Component
 * Modal to create a new folder
 * 
 * @param {Object} props
 * @param {Function} props.onClose - Close modal handler
 * @param {Function} props.onCreate - Create folder handler
 * @param {string} props.directoryPath - Current directory path
 * @param {boolean} props.loading - Create loading state
 */
export const FolderCreate = ({
  onClose,
  onCreate,
  directoryPath,
  loading = false,
}) => {
  const [folderName, setFolderName] = useState('');
  const [error, setError] = useState('');

  const handleCreate = async () => {
    // Validation
    if (!folderName.trim()) {
      setError('Folder name is required');
      return;
    }

    if (folderName.length > 255) {
      setError('Folder name is too long');
      return;
    }

    // Check for invalid characters
    const invalidChars = /[<>:"/\\|?*]/;
    if (invalidChars.test(folderName)) {
      setError('Folder name contains invalid characters');
      return;
    }

    await onCreate(folderName.trim(), directoryPath);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleCreate();
    }
  };

  const footer = (
    <>
      <Button variant="ghost" onClick={onClose} disabled={loading}>
        Cancel
      </Button>
      <Button
        variant="primary"
        onClick={handleCreate}
        disabled={!folderName.trim() || loading}
        icon={<FolderPlus size={16} />}
      >
        {loading ? 'Creating...' : 'Create Folder'}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Create New Folder"
      footer={footer}
      size="sm"
      closeOnBackdrop={!loading}
    >
      <div className="space-y-4">
        <Input
          label="Folder Name"
          value={folderName}
          onChange={(e) => {
            setFolderName(e.target.value);
            setError('');
          }}
          onKeyPress={handleKeyPress}
          error={error}
          placeholder="Enter folder name"
          required
          disabled={loading}
          autoFocus
        />

        {directoryPath && (
          <p className="text-xs text-gray-500">
            Folder will be created in: <span className="font-medium">/{directoryPath}</span>
          </p>
        )}
      </div>
    </Modal>
  );
};

export default FolderCreate;
