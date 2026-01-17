import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DirectoryHeader, FolderList, DirectoryModals } from './components';
import { FileList } from '@/features/file/components';
import { EmptyState, LoadingState, ErrorState, Toast } from '@/shared/components';
import { useDirectory, useDirectoryActions } from './hooks';
import { VIEW_MODES } from './constants/directory.constants.js';

/**
 * Directory View Component
 * Simplified to be a pure layout composer
 */
export const DirectoryView = () => {
  const { dirid } = useParams();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState(VIEW_MODES.GRID);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Toast - keeping local for now, but could be moved to context if needed
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  // 1. Data Fetching
  const {
    directoriesList,
    filesList,
    loading,
    error,
    isEmpty,
    fetchFiles,
  } = useDirectory(dirid);

  // 2. Action Logic (Extracted)
  const {
    modals,
    selectedItem,
    itemType,
    toggleModal,
    openRename,
    openDelete,
    openFileViewer,
    onCreateFolder,
    onUpload,
    onRename,
    onDelete,
    onDownload,
  } = useDirectoryActions(showToast, fetchFiles, dirid);

  // 3. Navigation
  const handleNavigate = (path) => {
    navigate(path ? `/directory/${path}` : '/');
  };

  const handleFolderClick = (folder) => {
    // const newPath = dirid ? `${dirid}/${folder.id}` : folder.id;
    navigate(`/directory/${folder.id}`);
  };

  // 4. Filtering
  const filteredFolders = searchQuery
    ? directoriesList.filter(folder => 
        folder.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : directoriesList;

  const filteredFiles = searchQuery
    ? filesList.filter(file => 
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filesList;

  // 5. Render
  if (error) {
    return (
      <div className="flex-1 bg-gray-50 p-6">
        <ErrorState error={error} onRetry={fetchFiles} />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 flex flex-col">
      <DirectoryHeader
        directoryPath={dirid}
        onNavigate={handleNavigate}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onCreateFolder={() => toggleModal('createFolder', true)}
        onUpload={() => toggleModal('upload', true)}
        onSearch={setSearchQuery}
      />

      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <LoadingState type="skeleton" count={6} />
        ) : isEmpty && !searchQuery ? (
          <EmptyState
            type="folder"
            action={{
              label: 'Upload Files',
              icon: null,
              onClick: () => toggleModal('upload', true),
            }}
          />
        ) : (
          <div className="space-y-8">
            {filteredFolders.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-gray-700 mb-3">Folders</h2>
                <FolderList
                  folders={filteredFolders}
                  viewMode={viewMode}
                  onClick={handleFolderClick}
                  onRename={(folder) => openRename(folder, 'folder')}
                  onDelete={(folder) => openDelete(folder, 'folder')}
                />
              </div>
            )}

            {filteredFiles.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-gray-700 mb-3">Files</h2>
                <FileList
                  files={filteredFiles}
                  viewMode={viewMode}
                  onView={openFileViewer}
                  onDownload={onDownload}
                  onRename={(file) => openRename(file, 'file')}
                  onDelete={(file) => openDelete(file, 'file')}
                />
              </div>
            )}

            {searchQuery && filteredFolders.length === 0 && filteredFiles.length === 0 && (
              <EmptyState type="search" />
            )}
          </div>
        )}
      </div>

      <DirectoryModals
        // States
        showCreateFolder={modals.createFolder}
        showUpload={modals.upload}
        showFileViewer={modals.fileViewer}
        showRename={modals.rename}
        showDelete={modals.delete}
        selectedItem={selectedItem}
        itemType={itemType}
        directoryPath={dirid}

        // Handlers
        onCloseCreate={() => toggleModal('createFolder', false)}
        onCreateFolder={onCreateFolder}
        onCloseUpload={() => toggleModal('upload', false)}
        onUpload={onUpload}
        onCloseFileViewer={() => toggleModal('fileViewer', false)}
        onDownload={onDownload}
        onCloseRename={() => toggleModal('rename', false)}
        onRename={onRename}
        onCloseDelete={() => toggleModal('delete', false)}
        onDelete={onDelete}
      />

      <Toast
        message={toast.message}
        type={toast.type}
        isOpen={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
};

export default DirectoryView;
