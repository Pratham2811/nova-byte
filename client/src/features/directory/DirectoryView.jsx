import React from 'react';
import { DirectoryProvider, useDirectoryContext } from './context/DirectoryContext.jsx';
import { DirectoryHeader, FolderList, DirectoryModals } from './components';
import { FileList } from '@/features/file/components';
import { EmptyState, LoadingState, ErrorState } from '@/shared/components';

/**
 * Directory Content Component
 * Consumes context and renders the directory layout
 * No props needed - everything comes from context!
 */
const DirectoryContent = () => {
  const {
    // State
    currentDirectoryId,
    directories,
    files,
    loading,
    error,
    isEmpty,
    searchQuery,
    
    // Actions
    toggleModal,
    refresh,
  } = useDirectoryContext();

  if (error) {
    return (
      <div className="flex-1 bg-gray-50 p-6">
        <ErrorState error={error} onRetry={refresh} />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 flex flex-col">
      {/* Header - consumes context directly */}
      <DirectoryHeader />

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
            {directories.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-gray-700 mb-3">Folders</h2>
                {/* FolderList consumes context directly */}
                <FolderList />
              </div>
            )}

            {files.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-gray-700 mb-3">Files</h2>
                {/* FileList consumes context directly */}
                <FileList />
              </div>
            )}

            {searchQuery && directories.length === 0 && files.length === 0 && (
              <EmptyState type="search" />
            )}
          </div>
        )}
      </div>

      {/* Modals - consumes context directly */}
      <DirectoryModals />
    </div>
  );
};

/**
 * Directory View Component
 * Wraps everything with DirectoryProvider
 * This is the entry point - no props drilling!
 */
export const DirectoryView = () => {
  return (
    <DirectoryProvider>
      <DirectoryContent />
    </DirectoryProvider>
  );
};

export default DirectoryView;
