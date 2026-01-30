import { useState } from 'react';
import { useFileActions } from '@/features/file/hooks';
import { uploadFiles,deleteFile } from '@/features/file/services/file.service';

/**
 * useDirectoryActions Hook
 * Centralizes all action handlers for DirectoryView to reduce complexity
 */
export const useDirectoryActions = (displayToast, fetchFiles, dirid) => {
  // Local state for modals (moved from DirectoryView)
  const [modals, setModals] = useState({
    createFolder: false,
    upload: false,
    fileViewer: false,
    rename: false,
    delete: false,
  });
  
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemType, setItemType] = useState('file'); // 'file' or 'folder'

  // Inherit base file actions
  const {
    handleDownloadFile,
    handleDeleteFile: baseDeleteFile,
    handleRenameFile: baseRenameFile,
    handleDeleteFolder: baseDeleteFolder,
    handleRenameFolder: baseRenameFolder,
  } = useFileActions(fetchFiles);

  // Helper to toggle modals
  const toggleModal = (modalName, isOpen = false) => {
    setModals(prev => ({ ...prev, [modalName]: isOpen }));
    if (!isOpen) { 
        // Don't clear selected item immediately if closing, potentially needed for animation? 
        // Actually safe to clear usually, but DirectoryView cleared it.
        // Let's mimic DirectoryView behavior manually in handlers
    }
  };

  const openRename = (item, type) => {
    setSelectedItem(item);
    setItemType(type);
    toggleModal('rename', true);
  };

  const openDelete = (item, type) => {
    setSelectedItem(item);
    setItemType(type);
    toggleModal('delete', true);
  };

  const openFileViewer = (file) => {
    setSelectedItem(file);
    toggleModal('fileViewer', true);
  };

  // --- Handlers ---

  const onRename = async (id, newName) => {
    try {
      if (itemType === 'folder') {
        await baseRenameFolder(id, selectedItem.name, newName);
        displayToast('Folder renamed successfully');
      } else {
        await baseRenameFile(id, selectedItem.name, newName);
        displayToast('File renamed successfully');
      }
      toggleModal('rename', false);
      setSelectedItem(null);
    } catch (err) {
      displayToast(err.message || 'Rename failed', 'error');
    }
  };

  const onDelete = async () => {
    try {
      if (itemType === 'folder') {
        // Folder Delete Flow
        await baseDeleteFolder(selectedItem);
        displayToast('Folder deleted successfully');
      } else {
 
        await baseDeleteFile(selectedItem); 
        displayToast('File deleted successfully');
      }
      toggleModal('delete', false);
      setSelectedItem(null);
    } catch (err) {
      displayToast(err.message || 'Delete failed', 'error');
    }
  };

  const onCreateFolder = async (folderName) => {
     // Note: In DirectoryView this was TODO. Do we have `createFolder` service?
     // Yes, likely in useFolderActions or directly service.
     // For now, let's keep the stub or implement if service is available.
     // In the original file it was: // await folderService.create...
     // Wait, I saw folder.service.js earlier. It has `createFolder`.
     // I should import it.
      try {
        const { createFolder } = await import('@/features/directory/services/folder.service');
        await createFolder(folderName, dirid);
        displayToast('Folder created successfully');
        toggleModal('createFolder', false);
        if (fetchFiles) fetchFiles();
      } catch (err) {
        displayToast(err.message || 'Failed to create folder', 'error');
      }
  };

  const onUpload = async (files) => {
    try {
      displayToast('Uploading files...', 'info');
      await uploadFiles(files, dirid);
      displayToast(`${files.length} file(s) uploaded successfully`);
      toggleModal('upload', false);
      if (fetchFiles) fetchFiles();
    } catch (err) {
      displayToast(err.message || 'Failed to upload files', 'error');
    }
  };

  return {
    // State
    modals,
    setModals, // Expose for direct opening if needed (e.g. Header)
    selectedItem,
    itemType,
    
    // Open Handlers
    openRename,
    openDelete,
    openFileViewer,
    toggleModal,

    // Action Handlers
    onRename,
    onDelete,
    onCreateFolder,
    onUpload,
    onDownload: handleDownloadFile,
  };
};
