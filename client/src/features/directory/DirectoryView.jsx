import React from 'react';
import { DirectoryProvider, useDirectoryContext } from './context/DirectoryContext';
import { DirectoryHeader, FolderList, DirectoryModals } from './components';
import { FileList } from '@/features/file/components';
import { EmptyState, LoadingState, ErrorState } from '@/shared/components';

const DirectoryContent = () => {
  const {
    directories,
    files,
    loading,
    error,
    isEmpty,
    searchQuery,
    openModal,
    refresh,
  } = useDirectoryContext();

  // Error State - Centered and clean
  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <ErrorState error={error} onRetry={refresh} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50/50">
      <DirectoryHeader />

      {/* Main Scrollable Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 sm:p-8 max-w-[1600px] mx-auto w-full min-h-full">
          
          {loading ? (
            <div className="animate-pulse space-y-8">
              <div className="h-8 w-32 bg-slate-200 rounded mb-4"></div>
              <LoadingState type="skeleton" count={6} />
            </div>
          ) : isEmpty && !searchQuery ? (
            <div className="h-[60vh] flex flex-col items-center justify-center">
              <EmptyState
                type="folder"
                title="No files found"
                description="Upload files or create a folder to get started."
                action={{
                  label: 'Upload Files',
                  onClick: () => openModal('upload'),
                }}
              />
            </div>
          ) : (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Folders Section */}
              {directories && directories.length > 0 && (
                <section>
                  <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-1 flex items-center gap-2">
                    Folders
                    <span className="bg-slate-100 text-slate-600 py-0.5 px-2 rounded-full text-[10px]">
                      {directories.length}
                    </span>
                  </h2>
                  <FolderList />
                </section>
              )}

              {/* Files Section */}
              {files && files.length > 0 && (
                <section>
                  <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-1 flex items-center gap-2">
                    Files
                    <span className="bg-slate-100 text-slate-600 py-0.5 px-2 rounded-full text-[10px]">
                      {files.length}
                    </span>
                  </h2>
                  <FileList />
                </section>
              )}

              {/* No Search Results */}
              {searchQuery && directories.length === 0 && files.length === 0 && (
                <div className="mt-20">
                  <EmptyState type="search" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <DirectoryModals />
    </div>
  );
};

/**
 * Directory View Component
 * Wraps everything with DirectoryProvider
 */
export const DirectoryView = () => {
  return (
    <DirectoryProvider>
      <DirectoryContent />
    </DirectoryProvider>
  );
};

export default DirectoryView;