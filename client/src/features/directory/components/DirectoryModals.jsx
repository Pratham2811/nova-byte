import React from 'react';
import { FolderCreate, RenameItem } from './';
import { FileViewer, FileUpload } from '@/features/file/components';
import { ConfirmDialog } from '@/shared/components';
import { useDirectoryContext } from '../context/DirectoryContext.jsx';

/**
 * DirectoryModals Component
 * Consumes context directly - NO PROPS NEEDED!
 * Centralized management of all directory-related modals
 */
export const DirectoryModals = () => {
  const {
    // Modal States
    modals,
    selectedItem,
    itemType,
    currentDirectoryId,
    
    // Modal Handlers
    toggleModal,
    onCreateFolder,
    onUpload,
    onRename,
    onDelete,
    onDownload,
  } = useDirectoryContext();

  return (
    <>
      {modals.createFolder && (
        <FolderCreate
          onClose={() => toggleModal('createFolder', false)}
          onCreate={onCreateFolder}
          directoryPath={currentDirectoryId}
        />
      )}

      {modals.upload && (
        <FileUpload
          onClose={() => toggleModal('upload', false)}
          onUpload={onUpload}
          directoryPath={currentDirectoryId}
        />
      )}

      {modals.fileViewer && selectedItem && (
        <FileViewer
          file={selectedItem}
          onClose={() => toggleModal('fileViewer', false)}
          onDownload={onDownload}
        />
      )}

      {modals.rename && selectedItem && (
        <RenameItem
          onClose={() => toggleModal('rename', false)}
          onRename={onRename}
          item={selectedItem}
          itemType={itemType}
        />
      )}

      {modals.delete && selectedItem && (
        <ConfirmDialog
          isOpen={true}
          onClose={() => toggleModal('delete', false)}
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

export default DirectoryModals;
