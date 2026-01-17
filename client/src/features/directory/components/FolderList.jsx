import React from 'react';
import { FolderCard } from './FolderCard.jsx';
import { EmptyState, LoadingState } from '@/shared/components';

/**
 * Folder List Component
 * Renders a list of folders using FolderCard components
 * 
 * @param {Object} props
 * @param {Array} props.folders - Array of folder objects
 * @param {boolean} props.loading - Loading state
 * @param {'grid'|'list'} props.viewMode - Display mode
 * @param {Function} props.onClick - Click handler to open folder
 * @param {Function} props.onRename - Rename folder handler
 * @param {Function} props.onDelete - Delete folder handler
 */
export const FolderList = ({
  folders = [],
  loading = false,
  viewMode = 'grid',
  onClick,
  onRename,
  onDelete,
}) => {
  if (loading) {
    return <LoadingState type="skeleton" count={3} />;
  }

  if (!folders || folders.length === 0) {
    return null; // Don't show empty state for folders, just hide the section
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-2">
        {folders.map((folder) => (
          <FolderCard
            key={folder.id}
            folder={folder}
            viewMode="list"
            onClick={onClick}
            onRename={onRename}
            onDelete={onDelete}
          />
        ))}
      </div>
    );
  }

  // Grid view
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {folders.map((folder) => (
        <FolderCard
          key={folder.id}
          folder={folder}
          viewMode="grid"
          onClick={onClick}
          onRename={onRename}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default FolderList;
