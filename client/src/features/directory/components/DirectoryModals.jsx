import React from 'react';
import { FolderCreate, RenameItem } from './';
import { FileViewer, FileUpload } from '@/features/file/components';
import { ConfirmDialog } from '@/shared/components';
import { useDirectoryContext } from '../context/DirectoryContext.jsx';
import { uploadFiles } from '@/features/file/services/file.service';
import { toast } from 'sonner';

/**
 * DirectoryModals Component
 * Centralized management of all directory-related modals
 */
export const DirectoryModals = () => {
  const {
    // Modal States
    modals,
    selectedItem,
    itemType,
    currentDirectoryId,
    closeModal,

    // Folder Actions
    createFolder,
    renameFolder,
    deleteFolder,

    // File Actions
    fileActions,

    // Refresh after actions
    refresh,
  } = useDirectoryContext();

  // Handle create folder
  const handleCreateFolder = async (folderName) => {
    const result = await createFolder(folderName, currentDirectoryId);
    if (result.success) {
      closeModal('createFolder');
    }
  };

  // Handle upload
  const handleUpload = async (files) => {
    try {
      toast.info('Uploading files...');
      await uploadFiles(files, currentDirectoryId);
      toast.success(`${files.length} file(s) uploaded`);
      closeModal('upload');
      refresh();
    } catch (error) {
      toast.error(error.message || 'Upload failed');
    }
  };

  // Handle rename
  const handleRename = async (id, newName) => {
    if (itemType === 'folder') {
      const result = await renameFolder(id, selectedItem.name, newName);
      if (result.success) closeModal('rename');
    } else {
      const result = await fileActions.renameFile(id, selectedItem.name, newName);
      if (result.success) closeModal('rename');
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (itemType === 'folder') {
      const result = await deleteFolder(selectedItem.id);
      if (result.success) closeModal('delete');
    } else {
      const result = await fileActions.deleteFile(selectedItem.id);
      if (result.success) closeModal('delete');
    }
  };

  return (
    <>
      {modals.createFolder && (
        <FolderCreate
          onClose={() => closeModal('createFolder')}
          onCreate={handleCreateFolder}
          directoryPath={currentDirectoryId}
        />
      )}

      {modals.upload && (
        <FileUpload
          onClose={() => closeModal('upload')}
          onUpload={handleUpload}
          directoryPath={currentDirectoryId}
        />
      )}

      {modals.fileViewer && selectedItem && (
        <FileViewer
          file={selectedItem}
          onClose={() => closeModal('fileViewer')}
          onDownload={() => fileActions.downloadFile(selectedItem)}
        />
      )}

      {modals.rename && selectedItem && (
        <RenameItem
          onClose={() => closeModal('rename')}
          onRename={handleRename}
          item={selectedItem}
          itemType={itemType}
        />
      )}

      {modals.delete && selectedItem && (
        <ConfirmDialog
          isOpen={true}
          onClose={() => closeModal('delete')}
          onConfirm={handleDelete}
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
