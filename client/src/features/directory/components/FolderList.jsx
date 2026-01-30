import React from 'react';
import { FolderCard } from './FolderCard.jsx';
import { LoadingState } from '@/shared/components';
import { useDirectoryContext } from '../context/DirectoryContext.jsx';

/**
 * Folder List Component
 * Consumes context directly - NO PROPS NEEDED!
 * Renders a list of folders using FolderCard components
 */
export const FolderList = () => {
  const {
    directories,
    loading,
    viewMode,
  } = useDirectoryContext();

  if (loading) {
    return <LoadingState type="skeleton" count={3} />;
  }

  if (!directories || directories.length === 0) {
    return null; // Don't show empty state for folders, just hide the section
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-2">
        {directories.map((folder) => (
          <FolderCard
            key={folder.id}
            folder={folder}
          />
        ))}
      </div>
    );
  }

  // Grid view
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {directories.map((folder) => (
        <FolderCard
          key={folder.id}
          folder={folder}
        />
      ))}
    </div>
  );
};

export default FolderList;
