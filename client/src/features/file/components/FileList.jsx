import React from 'react';
import { FileCard } from './FileCard.jsx';
import { LoadingState } from '@/shared/components';
import { useDirectoryContext } from '@/features/directory/context/DirectoryContext.jsx';

/**
 * File List Component
 * Consumes context directly - NO PROPS NEEDED!
 * Renders a list of files using FileCard components
 */
export const FileList = () => {
  const {
    files,
    loading,
    viewMode,
  } = useDirectoryContext();

  if (loading) {
    return <LoadingState type="skeleton" count={6} />;
  }

  if (!files || files.length === 0) {
    return null;
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-2">
        {files.map((file) => (
          <FileCard
            key={file.id}
            file={file}
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
        />
      ))}
    </div>
  );
};

export default FileList;
