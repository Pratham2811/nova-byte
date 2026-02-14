import React from 'react';
import { Folder, Pencil, Trash2, MoreHorizontal } from 'lucide-react';
import { useDirectoryContext } from '../context/DirectoryContext';
import { cn } from '@/lib/utils'; // Assuming you have a class merger, or use template literals

export const FolderCard = ({ folder }) => {
  const {
    viewMode,
    handleFolderClick,
    openModal,
  } = useDirectoryContext();

  const handleClick = (e) => {
    e.preventDefault();
    handleFolderClick(folder);
  };

  const handleRename = (e) => {
    e.stopPropagation();
    openModal('rename', folder, 'folder');
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    openModal('delete', folder, 'folder');
  };

  // --- List View ---
  if (viewMode === 'list') {
    return (
      <div
        onClick={handleClick}
        className="group flex items-center gap-3 px-4 py-3 bg-white border border-transparent hover:border-slate-200 hover:bg-slate-50 rounded-lg transition-all duration-200 cursor-pointer"
      >
        {/* Icon */}
        <div className="flex-shrink-0 text-indigo-500">
          <Folder size={20} className="fill-indigo-100/50" />
        </div>

        {/* Name */}
        <div className="flex-1 min-w-0">
          <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 truncate block">
            {folder.name}
          </span>
        </div>

        {/* Count */}
        {folder.itemCount !== undefined && (
          <div className="hidden sm:block w-24 text-right text-xs text-slate-400 group-hover:text-slate-500 font-mono">
            {folder.itemCount}
          </div>
        )}

        {/* Actions (Only visible on hover) */}
        <div className="w-16 flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleRename}
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
            title="Rename"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    );
  }

  // --- Grid View ---
  return (
    <div
      onClick={handleClick}
      className="group relative flex flex-col items-start justify-between p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md hover:border-indigo-300 transition-all duration-300 cursor-pointer h-32"
    >
      {/* Top Row: Icon + Actions */}
      <div className="w-full flex justify-between items-start">
        <div className="text-indigo-500 transition-transform duration-300 group-hover:scale-110 origin-top-left">
          <Folder size={32} className="fill-indigo-50" />
        </div>
        
        {/* Action Group (Simulating a menu) */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity -mr-2 -mt-2">
           <button
            onClick={handleRename}
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-md"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded-md"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Bottom Row: Text Info */}
      <div className="w-full mt-auto">
        <h3 className="text-sm font-semibold text-slate-700 truncate group-hover:text-indigo-600 transition-colors" title={folder.name}>
          {folder.name}
        </h3>
        {folder.itemCount !== undefined && (
          <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
            {folder.itemCount} items
          </p>
        )}
      </div>
    </div>
  );
};

export default FolderCard;