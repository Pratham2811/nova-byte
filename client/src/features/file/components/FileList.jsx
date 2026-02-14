import React from 'react';
import { FileCard } from './FileCard';
import { LoadingState } from '@/shared/components';
import { useDirectoryContext } from '@/features/directory/context/DirectoryContext';
import { Loader2 } from 'lucide-react';

/**
 * File List Component
 * Renders files in either Grid or List view with consistent animations and layout.
 */
export const FileList = () => {
  const {
    files,
    loading,
    viewMode,
  } = useDirectoryContext();

  if (loading) {
    return (
      <div className="flex h-32 w-full items-center justify-center text-slate-400">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!files || files.length === 0) {
    return null;
  }

  // --- List View ---
  if (viewMode === 'list') {
    return (
      <div className="flex flex-col gap-1 w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
        {/* Table Header */}
        <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center border-b border-transparent">
            <span className="flex-1">Name</span>
            <span className="w-32 hidden md:block text-left">Date</span>
            <span className="w-24 text-right hidden sm:block">Size</span>
            <span className="w-16"></span> {/* Spacer for actions */}
        </div>
        
        <div className="flex flex-col gap-1">
          {files.map((file) => (
            <FileCard
              key={file.id}
              file={file}
              viewMode="list"
            />
          ))}
        </div>
      </div>
    );
  }

  // --- Grid View ---
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {files.map((file) => (
        <FileCard
          key={file.id}
          file={file}
          viewMode="grid"
        />
      ))}
    </div>
  );
};

export default FileList;