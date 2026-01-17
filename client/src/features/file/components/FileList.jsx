import React from 'react';
import { FileCard } from './FileCard.jsx';
import { EmptyState, LoadingState } from '@/shared/components';

/**
 * File List Component
 * Renders a list of files using FileCard components
 * 
 * @param {Object} props
 * @param {Array} props.files - Array of file objects
 * @param {boolean} props.loading - Loading state
 * @param {'grid'|'list'} props.viewMode - Display mode
 * @param {Function} props.onView - View file handler
 * @param {Function} props.onDownload - Download file handler
 * @param {Function} props.onRename - Rename file handler
 * @param {Function} props.onDelete - Delete file handler
 */
export const FileList = ({
  files = [],
  loading = false,
  viewMode = 'grid',
  onView,
  onDownload,
  onRename,
  onDelete,
}) => {
  if (loading) {
    return <LoadingState type="skeleton" count={6} />;
  }

  if (!files || files.length === 0) {
    return <EmptyState type="file" />;
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-2">
        {files.map((file) => (
          <FileCard
            key={file.id}
            file={file}
            viewMode="list"
            onView={onView}
            onDownload={onDownload}
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
      {files.map((file) => (
        <FileCard
          key={file.id}
          file={file}
          viewMode="grid"
          onView={onView}
          onDownload={onDownload}
          onRename={onRename}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default FileList;
