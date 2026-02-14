import React from 'react';
import { FolderCard } from './FolderCard';
import { useDirectoryContext } from '../context/DirectoryContext';
import { Loader2 } from 'lucide-react';

export const FolderList = () => {
  const {
    directories,
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

  if (!directories || directories.length === 0) {
    return null;
  }

  // List View Container
  if (viewMode === 'list') {
    return (
      <div className="flex flex-col gap-1 w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center">
            <span className="flex-1">Name</span>
            <span className="w-24 text-right hidden sm:block">Items</span>
            <span className="w-16"></span>
        </div>
        {directories.map((folder) => (
          <FolderCard
            key={folder.id}
            folder={folder}
            viewMode="list"
          />
        ))}
      </div>
    );
  }

  // Grid View Container
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {directories.map((folder) => (
        <FolderCard
          key={folder.id}
          folder={folder}
          viewMode="grid"
        />
      ))}
    </div>
  );
};

export default FolderList;