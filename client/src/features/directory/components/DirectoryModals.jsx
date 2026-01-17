import React from 'react';
import { FolderCreate, RenameItem } from './';
import { FileViewer, FileUpload } from '@/features/file/components';
import { ConfirmDialog } from '@/shared/components';

/**
 * DirectoryModals Component
 * centralized management of all directory-related modals
 */
export const DirectoryModals = ({
  // State
  showCreateFolder,
  showUpload,
  showFileViewer,
  showRename,
  showDelete,
  selectedItem,
  itemType,
  directoryPath,

  // Handlers
  onCloseCreate,
  onCreateFolder,
  onCloseUpload,
  onUpload,
  onCloseFileViewer,
  onDownload,
  onCloseRename,
  onRename,
  onCloseDelete,
  onDelete,
}) => {
  return (
    <>
      {showCreateFolder && (
        <FolderCreate
          onClose={onCloseCreate}
          onCreate={onCreateFolder}
          directoryPath={directoryPath}
        />
      )}

      {showUpload && (
        <FileUpload
          onClose={onCloseUpload}
          onUpload={onUpload}
          directoryPath={directoryPath}
        />
      )}

      {showFileViewer && selectedItem && (
        <FileViewer
          file={selectedItem}
          onClose={onCloseFileViewer}
          onDownload={onDownload}
        />
      )}

      {showRename && selectedItem && (
        <RenameItem
          onClose={onCloseRename}
          onRename={onRename}
          item={selectedItem}
          itemType={itemType}
        />
      )}

      {showDelete && selectedItem && (
        <ConfirmDialog
          isOpen={true}
          onClose={onCloseDelete}
          onConfirm={onDelete}
          title={`Delete ${itemType === 'folder' ? 'Folder' : 'File'}`}
          message={`Are you sure you want to delete "${selectedItem.name}"? This action cannot be undone.`}
          confirmText="Delete"
          variant="danger"
        />
      )}
    </>
  );
};
